import fs from "node:fs";
import path from "node:path";

const PLACEHOLDER_RE = /<([^>]+)>/g;

export function scanForPlaceholders(content) {
  const found = [];
  if (!content) return found;
  let m;
  while ((m = PLACEHOLDER_RE.exec(content)) !== null) {
    found.push({ token: m[0], inner: m[1] });
  }
  return found;
}

function slugify(text) {
  return String(text || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function replacePlaceholdersWithHeuristics(content, meta = {}, force = false) {
  if (content == null) return { text: content, remaining: [] };
  const placeholderRe = PLACEHOLDER_RE;

  const replaced = content.replace(placeholderRe, (m, inner) => {
    const key = String(inner || "").trim();
    const k = key.toLowerCase();

    if (k.includes("year")) return String(meta.year || new Date().getFullYear());
    if (k.includes("phase")) return meta.phaseDefault || "Phase 1 - Foundation";
    if (k.includes("agent") || k.includes("agents") || k.includes("agent_path") || k.includes("agent-path") || k.includes("path")) {
      return meta.currentAgentRel || "AGENTS/agents-orchestrator.agent.md";
    }
    if (k.includes("slug")) return meta.projectSlug || slugify(meta.projectName || "project");
    if (k.includes("desc") || k.includes("description") || k.includes("summary")) return meta.projectDescription || meta.projectName || "";
    if (k.includes("project") || k.includes("name") || k.includes("title") || k.includes("repo") || k.includes("repository") || k.includes("app")) {
      return meta.projectName || "Project";
    }

    // leave unknown tokens untouched for now
    return m;
  });

  const remaining = scanForPlaceholders(replaced);
  let final = replaced;
  if (remaining.length && force) {
    final = replaced.replace(PLACEHOLDER_RE, "TBD");
  }

  return { text: final, remaining };
}

const ALLOWED_EXTS = new Set([
  ".md", ".markdown", ".txt", ".yaml", ".yml", ".json", ".js", ".mjs", ".ts",
  ".jsx", ".tsx", ".css", ".scss", ".html", ".htm", ".env", ".ini", ".cfg", ".conf",
  ".csv", ".xml", ".py", ".sh", ".ps1", ".rb", ".java", ".c", ".cpp", ".h", ".go",
  ".rs", ".php", ".sql"
]);

export function extensionAllowed(filePath) {
  const base = path.basename(filePath);
  const ext = path.extname(filePath).toLowerCase();
  const allowedBasenames = new Set(["LICENSE", "README", "Makefile", "Dockerfile"]);
  return ALLOWED_EXTS.has(ext) || allowedBasenames.has(base);
}

export function curateDirectoryFiles(paths, meta = {}, opts = {}) {
  const { dryRun = false, force = false } = opts;
  const changedFiles = [];
  const unfilled = {};
  let curatedCount = 0;

  for (const p of paths) {
    try {
      if (!fs.existsSync(p) || !fs.statSync(p).isFile()) continue;
      if (!extensionAllowed(p)) continue;

      const buf = fs.readFileSync(p);
      if (Buffer.prototype.indexOf && Buffer.prototype.indexOf.call(buf, 0) !== -1) continue;
      const raw = buf.toString("utf8");
      const { text, remaining } = replacePlaceholdersWithHeuristics(raw, meta, force);

      if (remaining && remaining.length) {
        unfilled[p] = remaining.map((r) => r.token);
      }

      const changed = text !== raw;
      if (changed) {
        curatedCount += 1;
        changedFiles.push(p);
        if (!dryRun) {
          fs.writeFileSync(p, text, "utf8");
        }
      }
    } catch (e) {
      // ignore problematic files
    }
  }

  return { curatedCount, changedFiles, unfilled };
}
