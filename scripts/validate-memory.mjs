import fs from "node:fs";
import path from "node:path";

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

function readIfExists(filePath) {
  if (!fs.existsSync(filePath)) {
    return "";
  }
  return fs.readFileSync(filePath, "utf8");
}

function collectLinks(markdown) {
  const regex = /\[[^\]]+\]\(([^)]+)\)/g;
  const links = [];
  let match;
  while ((match = regex.exec(markdown)) !== null) {
    links.push(match[1]);
  }
  return links;
}

function collectIds(markdown) {
  const regex = /\*\*ID:\*\*\s*([A-Z]+-[0-9]{8}-[A-Z0-9]+)/g;
  const ids = [];
  let match;
  while ((match = regex.exec(markdown)) !== null) {
    ids.push(match[1]);
  }
  return ids;
}

const args = parseArgs(process.argv);
const root = path.resolve(args.target || process.cwd());
const memoryRoot = path.join(root, ".github", "agent_memory");

const files = [
  "00_index.md",
  "01_decisions.md",
  "02_learnings.md",
  "03_actions.md",
  "04_blockers.md",
  "06_memory_health.md"
];

let brokenLinks = 0;
let duplicateIds = 0;
const allIds = [];

for (const name of files) {
  const full = path.join(memoryRoot, name);
  const content = readIfExists(full);
  if (!content) {
    continue;
  }

  for (const link of collectLinks(content)) {
    if (link.startsWith("http://") || link.startsWith("https://") || link.startsWith("#")) {
      continue;
    }
    const target = path.resolve(path.dirname(full), link.split("#")[0]);
    if (!fs.existsSync(target)) {
      brokenLinks += 1;
    }
  }

  allIds.push(...collectIds(content));
}

const seen = new Set();
for (const id of allIds) {
  if (seen.has(id)) {
    duplicateIds += 1;
  }
  seen.add(id);
}

const summary = {
  checkedAt: new Date().toISOString(),
  memoryRoot,
  brokenLinks,
  duplicateIds,
  filesChecked: files
};

console.log(JSON.stringify(summary, null, 2));
process.exit(brokenLinks > 0 || duplicateIds > 0 ? 1 : 0);
