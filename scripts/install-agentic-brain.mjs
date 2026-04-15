import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  AWESOME_TYPES,
  collectAwesomeCatalog,
  curateRequiredAssets,
  chooseProfileFromSignals,
  walkFiles,
  relUnix
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

function copyRecursive(src, dest) {
  const stats = fs.statSync(src);
  if (stats.isDirectory()) {
    ensureDir(dest);
    for (const name of fs.readdirSync(src)) {
      copyRecursive(path.join(src, name), path.join(dest, name));
    }
    return;
  }

  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
}

function copyRecursiveMerge(src, dest) {
  if (!fs.existsSync(src)) {
    return;
  }
  copyRecursive(src, dest);
}

function copyCoreAwesomeSubset(sourceRoot, vendorTarget) {
  const coreFiles = ["LICENSE", "README.md"];

  ensureDir(vendorTarget);

  for (const folder of AWESOME_TYPES) {
    const src = path.join(sourceRoot, folder);
    const dest = path.join(vendorTarget, folder);
    copyRecursiveMerge(src, dest);
  }

  for (const file of coreFiles) {
    const src = path.join(sourceRoot, file);
    const dest = path.join(vendorTarget, file);
    if (fs.existsSync(src)) {
      copyRecursive(src, dest);
    }
  }
}

function appendMemoryInstallEntry(memoryRoot, profile, selectedCount) {
  const actionsPath = path.join(memoryRoot, "03_actions.md");
  const now = new Date();
  const stamp = now.toISOString();
  const id = `ACT-${stamp.slice(0, 10).replace(/-/g, "")}-INSTALL`;

  const entry = [
    "",
    `- **ID:** ${id}`,
    `- **Timestamp:** ${stamp}`,
    "- **Agent:** installer",
    "- **Phase:** INSTALL",
    `- **Summary:** Installed Agentic Brain with core awesome-copilot subset and generated curated required assets for profile '${profile}'.`,
    "- **Artifacts:** .github/agentic_brain/vendor/awesome-copilot/{agents,instructions,skills,hooks,workflows,plugins}, .github/agentic_brain/catalog/awesome-catalog.json, .github/agentic_brain/catalog/required-assets.json",
    `- **Validation:** selected assets ${selectedCount}`,
    "- **Related:** [Memory Graph Contract](./01_decisions.md#memory-graph-contract)"
  ].join("\n");

  fs.appendFileSync(actionsPath, entry + "\n");
}

function appendDecisionEntry(memoryRoot, profile) {
  const decisionsPath = path.join(memoryRoot, "01_decisions.md");
  const day = new Date().toISOString().slice(0, 10);
  const id = `DEC-${day.replace(/-/g, "")}-CURATION`;

  const entry = [
    "",
    `## Install Curation Decision (${day})`,
    `- **ID:** ${id}`,
    "- **Status:** Accepted",
    `- **Date:** ${day}`,
    "- **Context:** Agentic Brain installation requires deterministic required-asset selection from the awesome-copilot core subset.",
    `- **Decision:** Use repo profile '${profile}' driven tag matching plus core orchestrator baseline.`,
    "- **Rationale:** Keeps installation broad while still producing a concise required set for execution order.",
    "- **Impacts:** required-assets catalog, required custom agents matrix"
  ].join("\n");

  fs.appendFileSync(decisionsPath, entry + "\n");
}

function writeReport(targetRoot, report) {
  const reportPath = path.join(targetRoot, ".github", "agentic_brain", "install-report.json");
  ensureDir(path.dirname(reportPath));
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  return reportPath;
}

const args = parseArgs(process.argv);
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const templateRoot = path.resolve(path.join(scriptDir, ".."));
const targetRoot = path.resolve(args.target || process.cwd());
const sourceRoot = path.resolve(args.source || path.join(templateRoot, "awesome-copilot-main"));
const mode = args.mode || "install";

if (!fs.existsSync(sourceRoot)) {
  console.error(`Source folder missing: ${sourceRoot}`);
  process.exit(1);
}

const githubTemplate = path.join(templateRoot, ".github_templates");
const agentsTemplate = path.join(templateRoot, "AGENTS_templates");
const prdTemplate = path.join(templateRoot, "PRD_TEMPLATE.md");

const githubTarget = path.join(targetRoot, ".github");
const agentsTarget = path.join(targetRoot, "AGENTS");

copyRecursiveMerge(githubTemplate, githubTarget);
copyRecursiveMerge(agentsTemplate, agentsTarget);

const prdTarget = path.join(targetRoot, "PRD_TEMPLATE.md");
if (!fs.existsSync(prdTarget) || mode === "install") {
  copyRecursive(prdTemplate, prdTarget);
}

const vendorTarget = path.join(githubTarget, "agentic_brain", "vendor", "awesome-copilot");
copyCoreAwesomeSubset(sourceRoot, vendorTarget);

const catalog = collectAwesomeCatalog(sourceRoot);
const repoFiles = walkFiles(targetRoot).map((f) => relUnix(targetRoot, f));
const profile = args.profile && args.profile !== "auto"
  ? args.profile
  : chooseProfileFromSignals(repoFiles);

const required = curateRequiredAssets(catalog, profile);

const catalogDir = path.join(githubTarget, "agentic_brain", "catalog");
ensureDir(catalogDir);

const catalogPath = path.join(catalogDir, "awesome-catalog.json");
fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2));

const requiredPath = path.join(catalogDir, "required-assets.json");
fs.writeFileSync(requiredPath, JSON.stringify(required, null, 2));

const memoryRoot = path.join(githubTarget, "agent_memory");
ensureDir(memoryRoot);

appendMemoryInstallEntry(memoryRoot, profile, required.selected.length);
appendDecisionEntry(memoryRoot, profile);

const report = {
  installedAt: new Date().toISOString(),
  mode,
  targetRoot,
  sourceRoot,
  profile,
  coreSubsetOnly: true,
  importedFolders: AWESOME_TYPES,
  importedKinds: catalog.totalsByKind,
  selectedCount: required.selected.length,
  excludedCount: required.excluded.length,
  catalogPath: relUnix(targetRoot, catalogPath),
  requiredPath: relUnix(targetRoot, requiredPath)
};

const reportPath = writeReport(targetRoot, report);

console.log("Agentic Brain installation complete");
console.log(`Target: ${targetRoot}`);
console.log(`Profile: ${profile}`);
console.log(`Core subset imported: ${AWESOME_TYPES.join(", ")}`);
console.log(`Catalog: ${catalogPath}`);
console.log(`Required: ${requiredPath}`);
console.log(`Report: ${reportPath}`);
