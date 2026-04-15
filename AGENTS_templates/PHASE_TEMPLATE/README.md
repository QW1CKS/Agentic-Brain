# <Phase Name e.g. Phase 1 - Foundation>

## Goal
<Short description of what needs to be achieved in this phase>

## Technical & Design Focus
<Outline the architectural goals, UI/UX focus, or structural setups expected within this phase>

## Agents In This Phase
- `.github/agents/agents-orchestrator.agent.md`
- `<path/to/agent1.agent.md>`
- `<path/to/agent2.agent.md>`

## Exit Criteria
- [ ] <Condition 1 - e.g. Monorepo builds successfully>
- [ ] <Condition 2 - e.g. Core contracts and interface definitions are signed off>
- [ ] <Condition 3 - e.g. Local development runtime is error-free>

## Required Artifacts
- <artifact path 1>
- <artifact path 2>

## Validation Commands
- Build: <command>
- Test: <command>
- Lint: <command>

## Required Agent Memory Workflow
- Every agent listed in this phase must execute a silent pre-flight read before task work begins:
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
- Every completed agent item must perform write-after-action updates:
	- append one row to `.github/agent_memory/03_actions.tsv`,
	- append to `01_decisions.md` or `02_learnings.md` when applicable,
	- append/update `04_blockers.md` for active blockers,
	- append one row to `.github/agent_memory/05_handoffs.tsv` when ownership changes.
- If `03_actions.tsv` or `05_handoffs.tsv` exceeds 100 lines, propose a memory compression task before continuing.
- TSV files must remain strictly tab-separated, one record per line, and never use markdown table syntax.

## Evidence Contract
- Every completed checklist item in this phase must include:
	- artifact path(s),
	- verification command result summary,
	- row reference to `.github/agent_memory/03_actions.tsv`.
