# Active Phase State

**🚨 CRITICAL: Every agent MUST follow these rules — NO EXCEPTIONS**

## Agent Scope Rules
1. **ONLY do tasks under YOUR agent section** — Do NOT do tasks from other agents' sections
2. **Load ALL memory files BEFORE any task** — Not optional, MANDATORY
3. **Write to memory AFTER every action** — Not optional, MANDATORY
4. **Load copilot-instructions.md FIRST** — Before any other file

## Related Docs

- Overview: [../README.md](../README.md)
- Installation guide: [../INSTALLATION.md](../INSTALLATION.md)
- Product requirements template: [../PRD.md](../PRD.md)
- Universal execution protocol: [../prompt.md](../prompt.md)
- Copilot workflow contract template: [../.github_templates/copilot-instructions.md](../.github_templates/copilot-instructions.md)
- Progress dashboard template: [./PROGRESS_DASHBOARD.md](./PROGRESS_DASHBOARD.md)
- Phase README template: [./PHASE_TEMPLATE/README.md](./PHASE_TEMPLATE/README.md)
- Phase checklist template: [./PHASE_TEMPLATE/CHECKLIST.md](./PHASE_TEMPLATE/CHECKLIST.md)

---

## 🚨 MANDATORY PRE-FLIGHT: BEFORE ANY TASK

**You MUST do this BEFORE doing ANY work:**

### Step 1: Load copilot-instructions.md (ALWAYS FIRST)
```powershell
cat .github/copilot-instructions.md
```

### Step 2: Load Memory Files (ALL REQUIRED)
```powershell
# Core memory
cat .github/agent_memory/00_index.md
cat .github/agent_memory/01_decisions.md
cat .github/agent_memory/02_learnings.md
cat .github/agent_memory/03_actions.tsv
cat .github/agent_memory/04_blockers.md
cat .github/agent_memory/05_handoffs.tsv
cat .github/agent_memory/06_memory_health.md
# Catalogs
cat .github/agentic_brain/catalog/awesome-catalog.yaml
cat .github/agentic_brain/catalog/required-assets.yaml
# Phase docs
cat AGENTS/ACTIVE_PHASE.md
cat AGENTS/PROGRESS_DASHBOARD.md
cat AGENTS/<Your Phase>/README.md
cat AGENTS/<Your Phase>/CHECKLIST.md
```

### Step 3: Identify Your Scope
- Find YOUR agent section in CHECKLIST.md
- ONLY do tasks listed under YOUR section
- Do NOT do tasks from other agents' sections

**Output confirmation:**
```
[System] Hybrid Brain Loaded. Memory: loaded. Scope: My assigned section only.
```

---

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
