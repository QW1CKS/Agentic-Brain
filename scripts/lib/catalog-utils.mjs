import fs from "node:fs";
import path from "node:path";

// Core subset scope only. These are the only awesome-copilot folders
// indexed and imported by Agentic Brain.
export const AWESOME_TYPES = [
  "agents",
  "instructions",
  "skills",
  "hooks",
  "workflows",
  "plugins"
];

export function parseFrontmatter(content) {
  if (!content.startsWith("---\n")) {
    return {};
  }

  const end = content.indexOf("\n---\n", 4);
  if (end === -1) {
    return {};
  }

  const block = content.slice(4, end);
  const result = {};

  for (const rawLine of block.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) {
      continue;
    }

    const idx = line.indexOf(":");
    if (idx <= 0) {
      continue;
    }

    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim().replace(/^['"]|['"]$/g, "");
    result[key] = value;
  }

  return result;
}

export function readTextSafe(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch {
    return "";
  }
}

export function walkFiles(rootDir) {
  if (!fs.existsSync(rootDir)) {
    return [];
  }

  const files = [];
  const stack = [rootDir];

  while (stack.length > 0) {
    const current = stack.pop();
    const entries = fs.readdirSync(current, { withFileTypes: true });

    for (const entry of entries) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(full);
        continue;
      }
      files.push(full);
    }
  }

  return files;
}

export function relUnix(base, filePath) {
  return path.relative(base, filePath).split(path.sep).join("/");
}

function toYamlScalar(value) {
  if (value === null || value === undefined) {
    return "null";
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return JSON.stringify(String(value));
}

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function yamlKey(key) {
  return /^[A-Za-z0-9_-]+$/.test(key) ? key : JSON.stringify(key);
}

export function toYaml(value, indent = 0) {
  const pad = " ".repeat(indent);

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return `${pad}[]`;
    }

    const lines = [];
    for (const item of value) {
      if (isObject(item) || Array.isArray(item)) {
        lines.push(`${pad}-`);
        lines.push(toYaml(item, indent + 2));
      } else {
        lines.push(`${pad}- ${toYamlScalar(item)}`);
      }
    }
    return lines.join("\n");
  }

  if (isObject(value)) {
    const entries = Object.entries(value);
    if (entries.length === 0) {
      return `${pad}{}`;
    }

    const lines = [];
    for (const [key, current] of entries) {
      const resolvedKey = yamlKey(key);

      if (Array.isArray(current)) {
        if (current.length === 0) {
          lines.push(`${pad}${resolvedKey}: []`);
        } else {
          lines.push(`${pad}${resolvedKey}:`);
          lines.push(toYaml(current, indent + 2));
        }
        continue;
      }

      if (isObject(current)) {
        if (Object.keys(current).length === 0) {
          lines.push(`${pad}${resolvedKey}: {}`);
        } else {
          lines.push(`${pad}${resolvedKey}:`);
          lines.push(toYaml(current, indent + 2));
        }
        continue;
      }

      lines.push(`${pad}${resolvedKey}: ${toYamlScalar(current)}`);
    }

    return lines.join("\n");
  }

  return `${pad}${toYamlScalar(value)}`;
}

export function inferTagsFromPath(relPath) {
  const lower = relPath.toLowerCase();
  const tags = [];

  const map = [
    "azure",
    "aws",
    "gcp",
    "react",
    "next",
    "frontend",
    "backend",
    "python",
    "node",
    "java",
    "go",
    "data",
    "ml",
    "infra",
    "security",
    "testing",
    "devops",
    "kubernetes",
    "terraform",
    "bicep"
  ];

  for (const candidate of map) {
    if (lower.includes(candidate)) {
      tags.push(candidate);
    }
  }

  return [...new Set(tags)];
}

export function classifyKind(typeFolder, relPath) {
  if (typeFolder === "skills") {
    return "skill";
  }
  if (typeFolder === "agents") {
    return "agent";
  }
  if (typeFolder === "instructions") {
    return "instruction";
  }
  if (typeFolder === "hooks") {
    return "hook";
  }
  if (typeFolder === "workflows") {
    return "workflow";
  }
  if (typeFolder === "plugins") {
    return relPath.endsWith("external.json") ? "plugin-external" : "plugin";
  }
  return "unknown";
}

export function collectAwesomeCatalog(awesomeRoot) {
  const generatedAt = new Date().toISOString();
  const assets = [];
  const totalsByKind = {};

  for (const typeFolder of AWESOME_TYPES) {
    const dir = path.join(awesomeRoot, typeFolder);
    const files = walkFiles(dir);

    for (const absPath of files) {
      const relPath = relUnix(awesomeRoot, absPath);
      const kind = classifyKind(typeFolder, relPath);
      const content = readTextSafe(absPath);
      const frontmatter = parseFrontmatter(content);
      const tags = inferTagsFromPath(relPath);

      const asset = {
        id: relPath.replace(/[^a-zA-Z0-9/_-]/g, "").replace(/\//g, "__"),
        kind,
        source: "awesome-copilot-main",
        path: relPath,
        name: frontmatter.name || path.basename(absPath),
        description: frontmatter.description || "",
        applyTo: frontmatter.applyTo || "",
        tools: frontmatter.tools || "",
        tags,
        sizeBytes: Buffer.byteLength(content, "utf8")
      };

      assets.push(asset);
      totalsByKind[kind] = (totalsByKind[kind] || 0) + 1;
    }
  }

  return {
    generatedAt,
    sourceRoot: awesomeRoot,
    totalsByKind,
    assets
  };
}

export function chooseProfileFromSignals(repoFiles) {
  const names = repoFiles.map((f) => f.toLowerCase());

  const has = (needle) => names.some((f) => f.endsWith(needle) || f.includes(needle));

  const score = {
    frontend: 0,
    backend: 0,
    fullstack: 0,
    data: 0,
    infra: 0
  };

  if (has("package.json") || has("next.config") || has("vite.config")) {
    score.frontend += 3;
    score.fullstack += 1;
  }
  if (has("pyproject.toml") || has("go.mod") || has("pom.xml") || has("dockerfile")) {
    score.backend += 3;
    score.fullstack += 1;
  }
  if (has("terraform") || has(".tf") || has("bicep") || has("helm")) {
    score.infra += 4;
  }
  if (has("notebooks") || has("requirements.txt") || has("environment.yml")) {
    score.data += 3;
  }

  if (score.frontend > 0 && score.backend > 0) {
    score.fullstack += 4;
  }

  const ranked = Object.entries(score).sort((a, b) => b[1] - a[1]);
  if (ranked[0][1] === 0) {
    return "fullstack";
  }
  return ranked[0][0];
}

export function curateRequiredAssets(catalog, profile) {
  const profileTags = {
    frontend: ["frontend", "react", "next", "testing", "security"],
    backend: ["backend", "python", "node", "java", "go", "testing", "security"],
    fullstack: ["frontend", "backend", "testing", "security", "devops"],
    data: ["data", "ml", "python", "testing", "security"],
    infra: ["infra", "devops", "terraform", "bicep", "kubernetes", "security"]
  };

  const mustInclude = [
    "agents__agents-orchestratoragentmd"
  ];

  const wantedTags = profileTags[profile] || profileTags.fullstack;
  const selected = [];
  const excluded = [];

  for (const asset of catalog.assets) {
    if (asset.kind === "plugin-external") {
      excluded.push({ path: asset.path, reason: "external plugin disabled by default" });
      continue;
    }

    const matchTag = asset.tags.some((t) => wantedTags.includes(t));
    const force = mustInclude.includes(asset.id.toLowerCase());

    if (force || matchTag || asset.kind === "instruction") {
      selected.push({
        path: asset.path,
        kind: asset.kind,
        reason: force ? "core orchestrator" : matchTag ? `matched profile tag for ${profile}` : "baseline instruction coverage"
      });
    } else {
      excluded.push({ path: asset.path, reason: `not matched to ${profile} profile` });
    }
  }

  return {
    profile,
    generatedAt: new Date().toISOString(),
    selected,
    excluded
  };
}
