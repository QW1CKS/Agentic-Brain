UNIVERSAL EXECUTION PROMPT

ALL CUSTOM AGENTS MUST FOLLOW THIS ORDERED PROTOCOL.

DO NOT SKIP STEPS.
DO NOT JUMP PHASES.
DO NOT TAKE ANOTHER AGENT'S RESPONSIBILITIES WITHOUT EXPLICIT APPROVAL.

## MODE 1: INSTALL MODE (when user asks to install Agentic Brain)

1) Pre-flight
- Read `.github/copilot-instructions.md` if present.
- Detect repository profile from available files:
  - frontend indicators: `package.json`, `vite.config.*`, `next.config.*`
  - backend indicators: `Dockerfile`, `pom.xml`, `go.mod`, `pyproject.toml`
  - data indicators: `notebooks/`, `requirements.txt`, `environment.yml`
  - infra indicators: `terraform/`, `*.tf`, `bicep/`, `.github/workflows/`

2) Install execution
- Run Agentic Brain installer.
- Import awesome-copilot core subset into `.github/agentic_brain/vendor/awesome-copilot/`.
  - Folders: `agents`, `instructions`, `skills`, `hooks`, `workflows`, `plugins`
  - Files: `LICENSE`, `README.md`
- Build asset catalog at `.github/agentic_brain/catalog/awesome-catalog.json`.
- Build curated required set at `.github/agentic_brain/catalog/required-assets.json`.

3) Memory bootstrap
- Initialize `.github/agent_memory/` append-only files.
- Add install entry to `03_actions.md` with timestamp and profile.
- Add curation decision entry to `01_decisions.md`.

4) Install report
- Output only:
  - detected profile,
  - installed asset counts,
  - curated required-agent summary,
  - blockers or missing tools,
  - exact next step.

## MODE 2: OPERATION MODE (normal phased execution)

1) Mandatory startup
- Read `AGENTS/ACTIVE_PHASE.md`.
- Read `AGENTS/PROGRESS_DASHBOARD.md`.
- Read `AGENTS/<current-phase>/README.md`.
- Read `AGENTS/<current-phase>/CHECKLIST.md`.
- Read `.github/agent_memory/00_index.md`.
- Read `.github/agent_memory/01_decisions.md`.
- Read `.github/agent_memory/02_learnings.md`.
- Read `.github/agent_memory/03_actions.md`.
- Read `.github/copilot-instructions.md`.

2) Scope lock
- Determine current phase and owning agent from `AGENTS/ACTIVE_PHASE.md`.
- Execute only assigned checklist items.
- Do not jump phase.

3) Execution loop
- Implement next unchecked assigned item.
- Verify with repo commands from PRD metadata:
  - build command,
  - test command,
  - lint command.
- Update checklist immediately with evidence:
  - files changed,
  - command output summary,
  - pass/fail status.

4) Memory write-after-action (mandatory)
- Append completed action entry to `.github/agent_memory/03_actions.md`.
- If a design or architecture choice was made, append to `01_decisions.md`.
- If a reusable pattern/lesson emerged, append to `02_learnings.md`.
- If blocked, append to `04_blockers.md` and reference impacted checklist item.

5) Handoff
- Update `AGENTS/ACTIVE_PHASE.md` only on ownership change.
- Append structured handoff line to `.github/agent_memory/05_handoffs.log`.
- Cross-link handoff to checklist and action entry.

6) Stop conditions
Stop only if:
1. Assigned section is complete and verified.
2. A real blocker requires user intervention.
3. A missing dependency makes further progress unsafe.

7) Blocked output format
- Exact blocker.
- What was attempted.
- Smallest required user action.

## NON-NEGOTIABLE QUALITY RULES

- Evidence-based completion only.
- Append-only memory behavior.
- No silent edits of previous memory history.
- Prefer deterministic, verifiable commands over assumptions.