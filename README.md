# Agentic Brain

Agentic Brain is an installable, repo-adaptive Copilot workflow template.

It combines:
- phase-gated execution (`AGENTS/`),
- structured custom-agent orchestration (`.github/agents/`),
- an importable core subset from `awesome-copilot-main`, and
- an append-only second-brain memory graph (`.github/agent_memory/`).

## What This Template Does

When a user asks Copilot to install Agentic Brain in any repository, the installer flow will:
1. Detect the target repository stack and commands.
2. Import only the awesome-copilot core subset (agents, instructions, skills, hooks, workflows, plugins).
3. Build a searchable local catalog of imported assets.
4. Generate a curated required-agent set for the detected repo profile.
5. Bootstrap a strict append-only memory graph with linked ledgers and logs.

## Core Subset Scope

The local `awesome-copilot-main/` snapshot is intentionally limited to:
- `agents/`
- `instructions/`
- `skills/`
- `hooks/`
- `workflows/`
- `plugins/`
- `LICENSE`
- `README.md`

Other upstream folders (for example docs, website, eng, and workflow infrastructure) are excluded from this template to keep installation deterministic and lightweight.

## High-Level Layout

- `AGENTS_templates/`: source templates for `AGENTS/` phase tracking and execution.
- `.github_templates/`: source templates for `.github/` copilot instructions, agents, and memory.
- `awesome-copilot-main/`: local corpus used for import and curation.
- `scripts/`: installer, indexing, curation, and memory-bootstrap automation.
- `schemas/`: machine-readable schema contracts for metadata, state, handoffs, and memory entries.
- `PRD_TEMPLATE.md`: repo-adaptive PRD contract consumed by the installer and orchestration flow.

## Install Trigger (Copilot Chat)

Use natural language in a target repo, for example:
- "Install Agentic Brain for this repository."
- "Install Agentic Brain and set up memory plus required custom agents."

The expected behavior is:
1. Copilot runs repository introspection.
2. Copilot executes the installer script in this template.
3. Copilot outputs a concise installation report and next actions.

## Local Script Install (Deterministic)

Run from this template root to install into a target repository path:

```powershell
node .\scripts\install-agentic-brain.mjs --target "C:\path\to\target-repo"
```

Optional flags:
- `--source <path>`: override awesome-copilot source location.
- `--mode install|update`: new install or merge update.
- `--profile auto|frontend|backend|fullstack|data|infra`: force repo profile.

## Installation Outputs

The installer writes:
- target `.github/` from `.github_templates/`.
- target `AGENTS/` from `AGENTS_templates/`.
- target `.github/agentic_brain/vendor/awesome-copilot/` (core subset only).
- target `.github/agentic_brain/catalog/awesome-catalog.yaml` (index).
- target `.github/agentic_brain/catalog/required-assets.yaml` (curated required set).
- target `.github/agent_memory/` append-only memory graph and install logs.

## Persistent Memory Contract

Memory is repository-local and append-only by default:
- `00_index.md`: graph index and reference map.
- `01_decisions.md`: immutable decision ledger.
- `02_learnings.md`: learnings and patterns.
- `03_actions.tsv`: chronological action telemetry ledger.
- `04_blockers.md`: active/resolved blockers.
- `05_handoffs.tsv`: append-only handoff telemetry ledger.
- `06_memory_health.md`: periodic health and link checks.

Every phase checklist entry must link to memory evidence entries.

## Safety and Attribution

- Source corpus subset: `awesome-copilot-main` core folders and license/readme (MIT licensed).
- External/untrusted remote plugin ingestion is disabled by default.
- Imported asset metadata includes provenance path and source label.

## Development Roadmap

- Phase 1: schema-first contracts and installer workflow docs.
- Phase 2: corpus ingestion and searchable catalog.
- Phase 3: deterministic curation and required-agent generation.
- Phase 4: strict memory graph with append-only logging and health checks.
- Phase 5: update mode, validation, and profile scenario testing.
