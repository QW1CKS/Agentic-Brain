# Phase <Number> Checklist - <Phase Name>

## Phase Goal
<Short description of the foundational phase goal>

## Key Deliverables
- [ ] Deliverable 1
- [ ] Deliverable 2

## Validation Commands (from PRD metadata)
- Build: <command>
- Test: <command>
- Lint: <command>

## Evidence Ledger Rules
- Mark `[x]` only after implementation and verification.
- Each completed action must include:
	- artifacts changed,
	- command result summary,
	- action row reference in `.github/agent_memory/03_actions.tsv`.
- Do not rewrite old evidence lines; append updates instead.

## Required Agent Memory Workflow
- Before any task execution, perform a silent pre-flight read of:
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
- Keep memory updates append-only. Never rewrite historical action/handoff rows.
- TSV rules are mandatory for `.tsv` files:
	- use literal tab separators,
	- keep each record to one physical line,
	- do not use markdown table pipes.
- If `03_actions.tsv` or `05_handoffs.tsv` exceeds 100 lines, propose a memory compression task before continuing.

---

## Agent 1 - `.github/agents/agents-orchestrator.agent.md`
### Memory Read
- [ ] Pre-flight checklist completed and all required memory/catalog files loaded.

### Actions
- [ ] Break phase down into checkpoints.
- [ ] Define precise done criteria for each item.
- [ ] Assign ownership of elements to subsequent agents.

### Outputs
- [ ] Status columns and checklist criteria created below.

### Exit Checks
- [ ] Checkpoints approved and sequential agent execution planned.

### Memory Write
- [ ] Append one row to `.github/agent_memory/03_actions.tsv`:
	- `Timestamp\tAgent_Phase\tAction_Summary\tFiles_Changed\tLinked_Decision_Node`
- [ ] If architectural decisions changed, append rationale to `.github/agent_memory/01_decisions.md`.
- [ ] If reusable operational insight emerged, append to `.github/agent_memory/02_learnings.md`.
- [ ] If blocked, append/update `.github/agent_memory/04_blockers.md` and reference the impacted checklist item.

### Evidence
- Artifacts: <paths>
- Validation: <command summary>
- Action Row: <timestamp + agent_phase row key in 03_actions.tsv>
- Decision/Learning Link: <optional relative markdown link>

---

## Agent 2 - `<path/to/some-agent.agent.md>`
### Memory Read
- [ ] Pre-flight checklist completed and all required memory/catalog files loaded.

### Actions
- [ ] Action task 1
- [ ] Action task 2

### Outputs
- [ ] Deliverable created in `/src/...`

### Exit Checks
- [ ] Tests and build validations pass.

### Memory Write
- [ ] Append one row to `.github/agent_memory/03_actions.tsv`:
	- `Timestamp\tAgent_Phase\tAction_Summary\tFiles_Changed\tLinked_Decision_Node`
- [ ] If architectural decisions changed, append rationale to `.github/agent_memory/01_decisions.md`.
- [ ] If reusable implementation insight emerged, append to `.github/agent_memory/02_learnings.md`.
- [ ] If blocked, append/update `.github/agent_memory/04_blockers.md` and reference the impacted checklist item.

### Evidence
- Artifacts: <paths>
- Validation: <command summary>
- Action Row: <timestamp + agent_phase row key in 03_actions.tsv>
- Decision/Learning Link: <optional relative markdown link>

---

## Agent 3 - `.github/agents/agents-orchestrator.agent.md` (Closing)
### Memory Read
- [ ] Pre-flight checklist completed and all required memory/catalog files loaded.

### Actions
- [ ] Validate evidence of all previous agents outputs.
- [ ] Confirm no existing blockers.

### Outputs
- [ ] `ACTIVE_PHASE.md` signed off.
- [ ] `PROGRESS_DASHBOARD.md` marked completed for this phase.

### Exit Checks
- [ ] Phase exit criteria and evidence integrity validated.

### Memory Write
- [ ] Append one row to `.github/agent_memory/03_actions.tsv`:
	- `Timestamp\tAgent_Phase\tAction_Summary\tFiles_Changed\tLinked_Decision_Node`
- [ ] Append handoff row to `.github/agent_memory/05_handoffs.tsv`:
	- `Timestamp\tFrom_Agent\tTo_Agent\tStatus\tNext_Action`
- [ ] If unresolved blocker remains, record in `.github/agent_memory/04_blockers.md` and reference handoff status.

### Handoff Record
- Handoff Status: <completed | blocked | escalated>
- Next Owner: <agent path>
- Handoff Row: <timestamp + from_agent + to_agent row key in .github/agent_memory/05_handoffs.tsv>
