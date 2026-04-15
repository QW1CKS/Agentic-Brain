# Decisions

## Memory Graph Contract
- **ID:** DEC-20260416-001
- **Status:** Accepted
- **Context:** This project uses a repo-local memory graph for agent behavior and delivery history.
- **Decision:** Keep memory in `.github/agent_memory/` and mirror it in `AGENTIC_WORKFLOW/.github_templates/agent_memory/`.
- **Rationale:** Makes the workflow easy to bootstrap and keeps the record close to the codebase.
- **Related:** [Learning: pre-flight and write-after-action](./02_learnings.md#pre-flight-and-write-after-action), [Action log template](./03_actions.md#action-log-template)

## Decision Entry Template
- **ID:** DEC-YYYYMMDD-XXX
- **Status:** <proposed|accepted|deprecated>
- **Date:** <YYYY-MM-DD>
- **Context:** <why this decision was needed>
- **Decision:** <what was chosen>
- **Rationale:** <tradeoffs>
- **Impacts:** <systems/files affected>
- **Related:** <links to actions, learnings, checklists>

## Install Curation Decision (2026-04-15)
- **ID:** DEC-20260415-CURATION
- **Status:** Accepted
- **Date:** 2026-04-15
- **Context:** Agentic Brain installation requires deterministic required-asset selection from awesome-copilot corpus.
- **Decision:** Use repo profile 'fullstack' driven tag matching plus core orchestrator baseline.
- **Rationale:** Keeps installation broad while still producing a concise required set for execution order.
- **Impacts:** required-assets catalog, required custom agents matrix
