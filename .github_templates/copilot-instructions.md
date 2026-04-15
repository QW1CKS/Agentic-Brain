# <Project Name> Copilot Workflow Instructions

These instructions define how Copilot agents should operate for this repository under an Agentic Workflow framework.

## Primary Operating Mode

- Execute strictly using a phase-driven workflow governed by `AGENTS/ACTIVE_PHASE.md`.
- Before formulating any response or execution plan, read:
  - `AGENTS/ACTIVE_PHASE.md`
  - `AGENTS/PROGRESS_DASHBOARD.md`
  - `AGENTS/<current-phase>/README.md`
  - `AGENTS/<current-phase>/CHECKLIST.md`
- Determine your identity (current agent) from the phase state and act exclusively in that role.
- If a user request falls outside the defined scope of the current phase, provide a brief explanation and route it to the backlog/ideas log. Do not pull features forward unless explicitly overridden by the prompt.

## Install Mode (Agentic Brain Bootstrap)

When user intent is "install Agentic Brain" or equivalent:
- Detect repository profile (frontend/backend/fullstack/data/infra).
- Run installer workflow to:
  - copy `.github_templates/` to `.github/`,
  - copy `AGENTS_templates/` to `AGENTS/`,
  - import awesome-copilot core subset (`agents`, `instructions`, `skills`, `hooks`, `workflows`, `plugins`, `LICENSE`, `README.md`),
  - generate local catalog and curated required set,
  - initialize append-only memory files.
- Output installation report with profile, imported counts, curated required list, and blockers.

Never silently skip installer steps.

## Second Brain Memory

- When bootstrapping a project, copy `.github_templates/agent_memory/` to `.github/agent_memory/`.
- Before answering, planning, editing, or running commands, perform a silent Pre-Flight Check and read:
  - `.github/copilot-instructions.md`
  - `.github/agent_memory/00_index.md`
  - `.github/agent_memory/01_decisions.md`
  - `.github/agent_memory/02_learnings.md`
  - `.github/agent_memory/03_actions.tsv`
  - `.github/agent_memory/04_blockers.md`
  - `.github/agent_memory/05_handoffs.tsv`
  - `.github/agent_memory/06_memory_health.md`
  - `.github/agentic_brain/catalog/awesome-catalog.yaml`
  - `.github/agentic_brain/catalog/required-assets.yaml`

Hybrid data format protocol:
- Markdown (`.md`) for reasoning and synthesis:
  - `01_decisions.md`
  - `02_learnings.md`
  - `04_blockers.md`
- TSV (`.tsv`) for append-only telemetry:
  - `03_actions.tsv`
  - `05_handoffs.tsv`
- YAML (`.yaml`) for machine-readable catalogs:
  - `awesome-catalog.yaml`
  - `required-assets.yaml`

Write-after-action rules:
1. Append one tab-separated row to `03_actions.tsv`:
   - `Timestamp\tAgent_Phase\tAction_Summary\tFiles_Changed\tLinked_Decision_Node`
2. If architecture or tradeoff decisions changed, append to `01_decisions.md`.
3. If reusable implementation insight emerged, append to `02_learnings.md`.
4. If blocked, append/update `04_blockers.md`.
5. On ownership change, append one tab-separated row to `05_handoffs.tsv`:
   - `Timestamp\tFrom_Agent\tTo_Agent\tStatus\tNext_Action`

TSV strict compliance:
- Use literal tab separators only.
- Keep each row to one physical line.
- Never use markdown table pipes.

Append-only policy:
- Do not rewrite old rows in `03_actions.tsv` or `05_handoffs.tsv`.
- Add corrections as new entries referencing prior IDs.
- Keep blockers in `04_blockers.md` with status tags.

Memory compression policy:
- If `03_actions.tsv` or `05_handoffs.tsv` exceeds 100 lines, propose a Memory Compression Task before continuing.

## Agent Sequencing Rule

- Work strictly in the defined agent order listed in `AGENTS/ACTIVE_PHASE.md` for the current phase.
- Only fulfill checklist items mapped to the **current agent** first.
- Only transfer ownership to the next agent in sequence when your designated exit criteria have visibly and evidently passed.
- Automatically update `AGENTS/ACTIVE_PHASE.md` and `AGENTS/PROGRESS_DASHBOARD.md` whenever an official agent handoff occurs.

## Progress Tracking Rule

- Every meaningful action or code change you make must be reflected in the phase's `CHECKLIST.md`.
- **Evidence-Based Completeness:** Do not arbitrarily check off `[ ]` to `[x]`. Provide the evidence in notes (e.g. tests passed, UI component rendered) before checking.
- Document any blockers or assumptions directly in the active checklist under your agent's jurisdiction.
- Include memory evidence links for every completed checklist item.

## Delivery Rule

- DO NOT advance or initialize the next phase unless the current phase's absolute exit criteria are completely verified by the Orchestrator agent.
- If the project scope requires modification, add explicitly scoped "Change Notes" to the active checklist before attempting an undocumented architectural shift.

## Awesome-Copilot Corpus Rule

- Imported corpus location: `.github/agentic_brain/vendor/awesome-copilot/`.
- Imported scope: core subset only (`agents`, `instructions`, `skills`, `hooks`, `workflows`, `plugins`, `LICENSE`, `README.md`).
- Generated catalog location: `.github/agentic_brain/catalog/awesome-catalog.yaml`.
- Curated required set location: `.github/agentic_brain/catalog/required-assets.yaml`.
- Use required set first for execution planning, then consult full catalog when expanding coverage.

Safety boundary:
- Do not auto-enable untrusted external plugin sources.
- Preserve provenance metadata when referencing imported assets.

## Custom Agent Authoring Rule

- Any new or modified custom agent file inside `.github/agents/*.agent.md` MUST include a `Critical Startup Steps` block to force dynamic reading of phase contexts.
- This block must read exactly as:
  ```markdown
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
  If present, read AGENTS/<current-phase>/<agent-specific-file>.md
  ```
- Refuse to finalize any PRs or updates merging `.agent.md` files that lack this required bootstrapping block.
