# Active Phase State

## Related Docs

- Overview: [../README.md](../README.md)
- Installation guide: [../INSTALLATION.md](../INSTALLATION.md)
- Product requirements template: [../PRD.md](../PRD.md)
- Universal execution protocol: [../prompt.md](../prompt.md)
- Copilot workflow contract template: [../.github_templates/copilot-instructions.md](../.github_templates/copilot-instructions.md)
- Progress dashboard template: [./PROGRESS_DASHBOARD.md](./PROGRESS_DASHBOARD.md)
- Phase README template: [./PHASE_TEMPLATE/README.md](./PHASE_TEMPLATE/README.md)
- Phase checklist template: [./PHASE_TEMPLATE/CHECKLIST.md](./PHASE_TEMPLATE/CHECKLIST.md)

## Current Phase
- Phase ID: <PHASE_ID_E.G._PHASE_1_FOUNDATION>
- Phase Name: <Phase Name E.G. Phase 1 - Foundation>
- Status: <not_started | in_progress | completed>
- Phase Started At: <YYYY-MM-DDTHH:MM:SSZ>
- Target Exit Date: <YYYY-MM-DD>

## Current Agent Ownership
- Current Agent: <path/to/current-agent.md>
- Next Agent: <path/to/next-agent.md>
- Ownership Last Changed At: <YYYY-MM-DDTHH:MM:SSZ>

## Agent Sequence For Current Phase
1. <path/to/agent1.md> 🔄 IN PROGRESS
2. <path/to/agent2.md> ⏳ PENDING

## Agent Dependency Graph
- <agent2> depends on outputs from <agent1>: <artifact paths>
- <agent3> depends on outputs from <agent2>: <artifact paths>

## Current Focus
- <What is currently being worked on>

## Last Completed Item
- <Brief description of the last done checklist item and standard evidence output>

## Verification Status
- Build: <pending | pass | fail> (<command used>)
- Test: <pending | pass | fail> (<command used>)
- Lint: <pending | pass | fail> (<command used>)
- Evidence Link: <row key in .github/agent_memory/03_actions.tsv>

## Blockers
- None active | <Describe active blockers here>

## Handoff Contract
- Last Handoff Row: <timestamp + from_agent + to_agent row key>
- Handoff Log Entry: <row key in .github/agent_memory/05_handoffs.tsv>
- Next Handoff Trigger: <what must be true before ownership moves>

## Last Updated
- <YYYY-MM-DD>

Return to overview: [../README.md](../README.md)
