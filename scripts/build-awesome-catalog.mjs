import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  collectAwesomeCatalog,
  curateRequiredAssets,
  chooseProfileFromSignals,
  toYaml,
  walkFiles
} from "./lib/catalog-utils.mjs";

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith("--")) {
      continue;
    }
    const key = token.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) {
      args[key] = "true";
      continue;
    }
    args[key] = next;
    i += 1;
  }
  return args;
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

const args = parseArgs(process.argv);
const thisFile = fileURLToPath(import.meta.url);
const templateRoot = path.resolve(path.join(path.dirname(thisFile), ".."));
const awesomeRoot = path.resolve(args.source || path.join(templateRoot, "awesome-copilot-main"));
const outDir = path.resolve(args.out || path.join(templateRoot, ".github_templates", "agentic_brain", "catalog"));
const profile = args.profile || "auto";
const targetRepo = path.resolve(args.target || templateRoot);

if (!fs.existsSync(awesomeRoot)) {
  console.error(`awesome-copilot source not found: ${awesomeRoot}`);
  process.exit(1);
}

ensureDir(outDir);

const catalog = collectAwesomeCatalog(awesomeRoot);
const catalogPath = path.join(outDir, "awesome-catalog.yaml");
fs.writeFileSync(catalogPath, `${toYaml(catalog)}\n`);

const repoFiles = walkFiles(targetRepo);
const resolvedProfile = profile === "auto" ? chooseProfileFromSignals(repoFiles) : profile;
const required = curateRequiredAssets(catalog, resolvedProfile);
const requiredPath = path.join(outDir, "required-assets.yaml");
fs.writeFileSync(requiredPath, `${toYaml(required)}\n`);

console.log(`Catalog built: ${catalogPath}`);
console.log(`Required set built: ${requiredPath}`);
console.log(`Profile: ${resolvedProfile}`);
console.log(`Selected assets: ${required.selected.length}`);
console.log(`Excluded assets: ${required.excluded.length}`);
