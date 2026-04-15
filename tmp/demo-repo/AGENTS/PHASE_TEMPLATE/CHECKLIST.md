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
	- memory link to `.github/agent_memory/03_actions.md`.
- Do not rewrite old evidence lines; append updates instead.

---

## Agent 1 - `.github/agents/agents-orchestrator.agent.md`
### Actions
- [ ] Break phase down into checkpoints.
- [ ] Define precise done criteria for each item.
- [ ] Assign ownership of elements to subsequent agents.

### Outputs
- [ ] Status columns and checklist criteria created below.

### Exit Checks
- [ ] Checkpoints approved and sequential agent execution planned.

### Evidence
- Artifacts: <paths>
- Validation: <command summary>
- Memory Link: <relative link to 03_actions.md>

---

## Agent 2 - `<path/to/some-agent.agent.md>`
### Actions
- [ ] Action task 1
- [ ] Action task 2

### Outputs
- [ ] Deliverable created in `/src/...`

### Exit Checks
- [ ] Tests and build validations pass.

### Evidence
- Artifacts: <paths>
- Validation: <command summary>
- Memory Link: <relative link to 03_actions.md>

---

## Agent 3 - `.github/agents/agents-orchestrator.agent.md` (Closing)
### Actions
- [ ] Validate evidence of all previous agents outputs.
- [ ] Confirm no existing blockers.

### Outputs
- [ ] `ACTIVE_PHASE.md` signed off.
- [ ] `PROGRESS_DASHBOARD.md` marked completed for this phase.

### Handoff Record
- Handoff ID: <HO-YYYYMMDD-XXX>
- Next Owner: <agent path>
- Handoff Log Link: <relative link to .github/agent_memory/05_handoffs.log>
