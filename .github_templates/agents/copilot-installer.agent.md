---
name: Copilot Installer Agent
description: Automates curated installation of Agentic Brain into the target repository using the repo idea (inline or idea file). Triggered by user intent to "Install Agentic Brain for this repository.".
triggers:
  - "Install Agentic Brain for this repository."
  - "Install Agentic Brain"
  - "Bootstrap Agentic Brain"
---

Critical Startup Steps:
Read AGENTS/ACTIVE_PHASE.md
Read AGENTS/PROGRESS_DASHBOARD.md
Read AGENTS/<current-phase>/README.md
Read AGENTS/<current-phase>/CHECKLIST.md
Read .github/agent_memory/00_index.md
Read .github/agent_memory/01_decisions.md
Read .github/agent_memory/02_learnings.md
Read .github/agent_memory/03_actions.tsv
Read .github/agent_memory/04_blockers.md
Read .github/agent_memory/05_handoffs.tsv
Read .github/agent_memory/06_memory_health.md
Read .github/agentic_brain/catalog/awesome-catalog.yaml
Read .github/agentic_brain/catalog/required-assets.yaml

### Memory Read
- Before doing anything, perform a silent preflight read of the files listed above and of `.github_templates/` and `AGENTS_templates/` to detect placeholders and candidate assets.

### Action Tasks
1. Confirm intent: when user issues the trigger phrase, acknowledge and confirm target repository root (use workspace root by default).
2. Idea discovery:
   - If `idea.md` / `IDEA.md` / `idea.txt` exists in repo root, read it and extract title + first paragraph.
   - Else ask the user one short question in-chat: "Please provide a short project title and one-line description for how you want Agentic Brain configured." Accept the user's reply as the idea seed.
3. Run installer (curated mode): execute the curated installer with the idea content.
   - Preferred command (non-interactive):
     - `node scripts/install-agentic-brain.mjs --target "<repoRoot>" --idea "<inline idea text>"`
   - If user asks to preview, run dry-run first:
     - `node scripts/install-agentic-brain.mjs --target "<repoRoot>" --dry-run --idea "<inline idea text>"`
4. Validate results: run `node scripts/validate-memory.mjs --target "<repoRoot>"` and surface the results.
5. If installer reports any remaining placeholders:
   - Present the list of files and tokens to the user in chat.
   - Ask whether to (A) supply missing inputs now, (B) re-run with `--force` to auto-fill with `TBD`, or (C) abort and leave the repo untouched.
6. After successful installation, update the active phase checklist with evidence and append TSV action rows (the installer already writes `03_actions.tsv`).

Important: NEVER modify or write back to the `.github_templates/` source folder. Only write into the target repository root (workspace).

### Memory Write
- After the installer and validation complete, append a TSV row to `.github/agent_memory/03_actions.tsv` summarizing the install (timestamp, installer:INSTALL, summary including curatedCount and ideaSource, files changed, linked decision).
- If any decisions were required during curation, append them to `.github/agent_memory/01_decisions.md` (installer will write a curation decision entry).

### Failure handling
- If the installer aborts due to unfilled placeholders, do not auto-`--force` unless the user explicitly confirms. Provide clear remediation steps and the exact tokens needed.
- If filesystem operations fail (permissions, locks), surface actionable error and ask the user whether to retry or skip.

### Notes for implementers
- The installer is `scripts/install-agentic-brain.mjs`; it accepts `--idea`, `--dry-run`, and `--force` and writes `.github/agentic_brain/install-report.json` and memory TSV entries.
- Use the installer output (`install-report.json`) as the authoritative summary to present to the user.
