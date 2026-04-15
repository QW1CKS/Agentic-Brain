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

function validateTsv(filePath, expectedHeader, label) {
  const errors = [];

  if (!fs.existsSync(filePath)) {
    errors.push(`${label}: missing file`);
    return { errors, lineCount: 0 };
  }

  const content = fs.readFileSync(filePath, "utf8");
  if (!content.trim()) {
    errors.push(`${label}: file is empty`);
    return { errors, lineCount: 0 };
  }

  const lines = content.split(/\r?\n/).filter((line) => line.length > 0);
  const expectedColumns = expectedHeader.split("\t").length;

  if (lines[0] !== expectedHeader) {
    errors.push(`${label}: invalid header`);
  }

  for (let index = 1; index < lines.length; index += 1) {
    const line = lines[index];
    const rowNumber = index + 1;

    if (line.includes("|")) {
      errors.push(`${label}: row ${rowNumber} contains markdown pipe characters`);
    }

    if (!line.includes("\t")) {
      errors.push(`${label}: row ${rowNumber} is not tab-separated`);
    }

    const columns = line.split("\t");
    if (columns.length !== expectedColumns) {
      errors.push(
        `${label}: row ${rowNumber} has ${columns.length} columns, expected ${expectedColumns}`
      );
    }
  }

  return { errors, lineCount: lines.length };
}

const args = parseArgs(process.argv);
const root = path.resolve(args.target || process.cwd());
const memoryRoot = path.join(root, ".github", "agent_memory");

const markdownFiles = [
  "00_index.md",
  "01_decisions.md",
  "02_learnings.md",
  "04_blockers.md",
  "06_memory_health.md"
];

const tsvFiles = [
  {
    name: "03_actions.tsv",
    header: "Timestamp\tAgent_Phase\tAction_Summary\tFiles_Changed\tLinked_Decision_Node"
  },
  {
    name: "05_handoffs.tsv",
    header: "Timestamp\tFrom_Agent\tTo_Agent\tStatus\tNext_Action"
  }
];

let brokenLinks = 0;
let duplicateIds = 0;
const missingFiles = [];
const brokenLinkDetails = [];
const tsvErrors = [];
const compressionRecommendations = [];
const tsvLineCounts = {};
const allIds = [];

for (const name of markdownFiles) {
  const full = path.join(memoryRoot, name);
  if (!fs.existsSync(full)) {
    missingFiles.push(name);
    continue;
  }

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
      brokenLinkDetails.push({ file: name, link });
    }
  }

  allIds.push(...collectIds(content));
}

for (const tsv of tsvFiles) {
  const full = path.join(memoryRoot, tsv.name);
  const result = validateTsv(full, tsv.header, tsv.name);
  tsvLineCounts[tsv.name] = result.lineCount;
  tsvErrors.push(...result.errors);

  if (result.lineCount > 100) {
    compressionRecommendations.push(
      `${tsv.name} has ${result.lineCount} lines. Propose memory compression for oldest entries.`
    );
  }
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
  brokenLinkDetails,
  duplicateIds,
  missingFiles,
  tsvErrors,
  compressionRecommendations,
  tsvLineCounts,
  filesChecked: {
    markdown: markdownFiles,
    tsv: tsvFiles.map((item) => item.name)
  }
};

console.log(JSON.stringify(summary, null, 2));
const hasFailures =
  brokenLinks > 0 || duplicateIds > 0 || missingFiles.length > 0 || tsvErrors.length > 0;
process.exit(hasFailures ? 1 : 0);
