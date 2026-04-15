# Agentic Brain Installation Guide

## Copilot Chat Install

In a target repository, ask Copilot:
- "Install Agentic Brain for this repository."

Expected actions:
1. Profile detection (frontend/backend/fullstack/data/infra).
2. Template copy (`.github_templates` -> `.github`, `AGENTS_templates` -> `AGENTS`).
3. awesome-copilot core-subset import into `.github/agentic_brain/vendor/awesome-copilot/`.
	- Imported folders: `agents`, `instructions`, `skills`, `hooks`, `workflows`, `plugins`
	- Imported files: `LICENSE`, `README.md`
4. Catalog generation and curated required set generation.
5. Memory graph bootstrap and install log entries.

## Script Install

Run from this template root:

```powershell
node .\scripts\install-agentic-brain.mjs --target "C:\path\to\repo"
```

Optional:
- `--source <path>`
- `--mode install|update`
- `--profile auto|frontend|backend|fullstack|data|infra`

## Validation

```powershell
npm run memory:validate -- --target "C:\path\to\repo"
```

## Outputs to Check

- `.github/agentic_brain/catalog/awesome-catalog.yaml`
- `.github/agentic_brain/catalog/required-assets.yaml`
- `.github/agentic_brain/install-report.json`
- `.github/agent_memory/00_index.md`
- `.github/agent_memory/03_actions.tsv`
- `.github/agent_memory/05_handoffs.tsv`
