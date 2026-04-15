# Actions

## Action Log Template
- Use this file for completed work.
- Start each entry with a date, a short summary, and links back to the decision or learning that justified the change.
- Example format: `- YYYY-MM-DD: Updated ... [Decision](./01_decisions.md#memory-graph-contract)`

## Append-Only Entry Template
- **ID:** ACT-YYYYMMDD-XXX
- **Timestamp:** YYYY-MM-DDTHH:MM:SSZ
- **Agent:** <agent name/path>
- **Phase:** <phase ID>
- **Summary:** <what was done>
- **Artifacts:** <paths>
- **Validation:** <command summaries>
- **Related:** <decision/learning/checklist links>

## Bootstrap Example
- **ID:** ACT-20260416-001
- **Timestamp:** 2026-04-16T00:00:00Z
- **Agent:** installer
- **Phase:** INSTALL
- **Summary:** Initialized Agentic Brain memory graph and imported awesome-copilot core subset (`agents`, `instructions`, `skills`, `hooks`, `workflows`, `plugins`).
- **Artifacts:** `.github/agent_memory/*`, `.github/agentic_brain/vendor/awesome-copilot/*`, `.github/agentic_brain/catalog/*`
- **Validation:** installer completed without fatal errors
- **Related:** [Memory Graph Contract](./01_decisions.md#memory-graph-contract)

- **ID:** ACT-20260415-INSTALL
- **Timestamp:** 2026-04-15T22:49:22.068Z
- **Agent:** installer
- **Phase:** INSTALL
- **Summary:** Installed Agentic Brain with core awesome-copilot subset and generated curated required assets for profile 'fullstack'.
- **Artifacts:** .github/agentic_brain/vendor/awesome-copilot/{agents,instructions,skills,hooks,workflows,plugins}, .github/agentic_brain/catalog/awesome-catalog.json, .github/agentic_brain/catalog/required-assets.json
- **Validation:** selected assets 256
- **Related:** [Memory Graph Contract](./01_decisions.md#memory-graph-contract)
