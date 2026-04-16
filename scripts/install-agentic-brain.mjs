import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  AWESOME_TYPES,
  collectAwesomeCatalog,
  curateRequiredAssets,
  chooseProfileFromSignals,
  toYaml,
  walkFiles,
  relUnix
} from "./lib/catalog-utils.mjs";
import { curateDirectoryFiles } from "./lib/placeholder-utils.mjs";

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

function sanitizeTsvField(value) {
  return String(value ?? "")
    .replace(/[\r\n]+/g, " ")
    .replace(/\t+/g, " ")
    .trim();
}

function ensureTsvHeader(filePath, header) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, `${header}\n`);
    return;
  }

  const content = fs.readFileSync(filePath, "utf8");
  if (!content.trim()) {
    fs.writeFileSync(filePath, `${header}\n`);
    return;
  }

  const firstLine = content.split(/\r?\n/, 1)[0];
  if (firstLine !== header) {
    throw new Error(`Invalid TSV header in ${filePath}`);
  }
}

function appendTsvRow(filePath, values) {
  const row = values.map(sanitizeTsvField).join("\t");
  const content = fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : "";
  const prefix = !content || content.endsWith("\n") ? "" : "\n";
  fs.appendFileSync(filePath, `${prefix}${row}\n`);
}

function appendMemoryInstallEntry(memoryRoot, profile, selectedCount, curatedCount = 0, ideaSource = null) {
  const actionsPath = path.join(memoryRoot, "03_actions.tsv");
  const now = new Date();
  const stamp = now.toISOString();
  const header = "Timestamp\tAgent_Phase\tAction_Summary\tFiles_Changed\tLinked_Decision_Node";
  ensureTsvHeader(actionsPath, header);
  const actionSummary = `Installed Agentic Brain with core awesome-copilot subset for profile '${profile}' and selected ${selectedCount} required assets. CuratedFiles:${curatedCount} IdeaSource:${ideaSource || "none"}`;
  appendTsvRow(actionsPath, [
    stamp,
    "installer:INSTALL",
    actionSummary,
    ".github/agentic_brain/vendor/awesome-copilot/{agents,instructions,skills,hooks,workflows,plugins};.github/agentic_brain/catalog/awesome-catalog.yaml;.github/agentic_brain/catalog/required-assets.yaml",
    "01_decisions.md#memory-graph-contract"
  ]);
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

function flagValue(name) {
  const v = args[name] ?? args[name.replace(/-/g, "")] ?? args[name.replace(/-/g, "_")];
  if (v === undefined) return false;
  if (v === true) return true;
  if (typeof v === "string") return v === "true" || v === "1";
  return Boolean(v);
}

function readIdeaContentFromArgs(args, targetRoot) {
  if (!args.idea) {
    const candidates = ["idea.md", "IDEA.md", "idea.txt", "IDEA.txt"];
    for (const name of candidates) {
      const p = path.join(targetRoot, name);
      if (fs.existsSync(p) && fs.statSync(p).isFile()) {
        try {
          return { content: fs.readFileSync(p, "utf8"), source: p };
        } catch {
          return { content: "", source: p };
        }
      }
    }
    return { content: "", source: null };
  }

  const raw = args.idea;
  const maybePath = path.resolve(String(raw));
  if (fs.existsSync(maybePath) && fs.statSync(maybePath).isFile()) {
    try {
      return { content: fs.readFileSync(maybePath, "utf8"), source: maybePath };
    } catch {
      return { content: String(raw), source: "inline" };
    }
  }

  return { content: String(raw), source: "inline" };
}

function deriveProjectMeta(opts = {}) {
  const { ideaContent, targetRoot, agentsTarget } = opts;
  let projectName = "";
  let projectDescription = "";

  if (ideaContent) {
    const titleMatch = ideaContent.match(/^\s*#\s*(.+)$/m);
    if (titleMatch) {
      projectName = titleMatch[1].trim();
      const after = ideaContent.slice(ideaContent.indexOf(titleMatch[0]) + titleMatch[0].length);
      const paraMatch = after.match(/^\s*([\s\S]*?)\r?\n\r?\n/m);
      if (paraMatch) {
        projectDescription = paraMatch[1].trim();
      } else {
        const firstNonEmpty = after.split(/\r?\n/).find((l) => l.trim());
        projectDescription = firstNonEmpty ? firstNonEmpty.trim() : "";
      }
    } else {
      const first = ideaContent.split(/\r?\n/).find((l) => l.trim());
      if (first) {
        projectName = first.trim();
        const idx = ideaContent.indexOf(first);
        const rest = ideaContent.slice(idx + first.length);
        const para = rest.split(/\r?\n\r?\n/)[0];
        projectDescription = para ? para.trim() : "";
      }
    }
  }

  if (!projectName) projectName = path.basename(targetRoot) || "Agentic Brain Project";
  if (!projectDescription) projectDescription = `${projectName} - generated by Agentic Brain`;

  const projectSlug = projectName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const year = opts.year || new Date().getFullYear();

  let currentAgentRel = "AGENTS/agents-orchestrator.agent.md";
  try {
    const orchestrator = path.join(agentsTarget, "agents-orchestrator.agent.md");
    if (fs.existsSync(orchestrator)) {
      currentAgentRel = relUnix(targetRoot, orchestrator);
    } else if (fs.existsSync(agentsTarget)) {
      const files = walkFiles(agentsTarget).filter((f) => f.endsWith(".agent.md"));
      if (files.length) currentAgentRel = relUnix(targetRoot, files[0]);
    }
  } catch {
    // ignore
  }

  const phaseDefault = "Phase 1 - Foundation";

  return {
    projectName,
    projectSlug,
    projectDescription,
    year,
    currentAgentRel,
    phaseDefault
  };
}

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

// --- Curation pass (uses user idea if provided) -------------------------
const dryRun = flagValue("dry-run");
const force = flagValue("force");
const ideaResult = readIdeaContentFromArgs(args, targetRoot);
const ideaContent = ideaResult.content;
const ideaSource = ideaResult.source;
const meta = deriveProjectMeta({ ideaContent, targetRoot, agentsTarget, year: args.year });

// collect files copied into target for curation
const filesToCurate = [];
if (fs.existsSync(githubTarget)) filesToCurate.push(...walkFiles(githubTarget));
if (fs.existsSync(agentsTarget)) filesToCurate.push(...walkFiles(agentsTarget));
if (fs.existsSync(prdTarget)) filesToCurate.push(prdTarget);
const absFilesToCurate = Array.from(new Set(filesToCurate.map((f) => path.resolve(f))));

const curationResult = curateDirectoryFiles(absFilesToCurate, meta, { dryRun, force });
const curatedCount = curationResult.curatedCount || 0;

if (!force && curationResult.unfilled && Object.keys(curationResult.unfilled).length) {
  console.error("Curation aborted: unfilled placeholders found. Provide --force to auto-fill or supply idea inputs.");
  for (const [file, tokens] of Object.entries(curationResult.unfilled)) {
    console.error(`${file}: ${tokens.join(", ")}`);
  }
  process.exit(1);
}

if (dryRun) {
  console.log(`Dry-run: ${curationResult.curatedCount} files would be curated.`);
  if (curationResult.changedFiles && curationResult.changedFiles.length) {
    console.log("Files that would be modified:");
    for (const f of curationResult.changedFiles) console.log(` - ${f}`);
  }
  if (curationResult.unfilled && Object.keys(curationResult.unfilled).length) {
    console.log("Unfilled placeholders:");
    for (const [file, tokens] of Object.entries(curationResult.unfilled)) {
      console.log(`${file}: ${tokens.join(", ")}`);
    }
  }
  process.exit(0);
}
// -------------------------------------------------------------------------

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

const catalogPath = path.join(catalogDir, "awesome-catalog.yaml");
fs.writeFileSync(catalogPath, `${toYaml(catalog)}\n`);

const requiredPath = path.join(catalogDir, "required-assets.yaml");
fs.writeFileSync(requiredPath, `${toYaml(required)}\n`);

const memoryRoot = path.join(githubTarget, "agent_memory");
ensureDir(memoryRoot);
if (!dryRun) {
  appendMemoryInstallEntry(memoryRoot, profile, required.selected.length, curatedCount, ideaSource);
  appendDecisionEntry(memoryRoot, profile);
}

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

if (ideaSource) report.ideaSource = ideaSource;
report.curatedCount = curatedCount || 0;

const reportPath = writeReport(targetRoot, report);

console.log("Agentic Brain installation complete");
console.log(`Target: ${targetRoot}`);
console.log(`Profile: ${profile}`);
console.log(`Core subset imported: ${AWESOME_TYPES.join(", ")}`);
console.log(`Catalog: ${catalogPath}`);
console.log(`Required: ${requiredPath}`);
console.log(`Report: ${reportPath}`);
