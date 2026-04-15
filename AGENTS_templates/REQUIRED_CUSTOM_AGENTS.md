# Required Custom Agents for <Project Name>

This is the mandatory custom-agent set for delivering the project end to end.

No optional agents should be included here.

This file is generated/updated from:
- `.github/agentic_brain/catalog/required-assets.yaml`
- repository profile detection (`frontend`, `backend`, `fullstack`, `data`, `infra`)

## How To Use This File

Short answer: execute work phase by phase, and inside each phase run the listed agents in a strictly defined sequential order.

Use this operational loop for every phase:

1. Orchestrator opens the phase and sets scope, deliverables, and acceptance criteria.
2. Domain-specific agents (e.g., architecture, design, backend) implement work in small defined batches.
3. Testing and Security agents evaluate data states and code functionality locally.
4. Orchestrator closes the phase only when all exit criteria pass.

**CRITICAL RULE:** Do not start the next phase until the current phase exit criteria are entirely met.

## Curation Inputs
- **Repo Profile:** <auto|frontend|backend|fullstack|data|infra>
- **Risk Posture:** <strict|balanced|exploratory>
- **Capability Priorities:** <security, testing, performance, docs, infra, data, uiux>
- **Generated At:** <YYYY-MM-DDTHH:MM:SSZ>

## Required Agents Only

1. `.github/agents/agents-orchestrator.agent.md`
**Purpose:** Coordinates all other agents, assigns ownership by phase, ensures tasks are completed via evidence, and prevents workflow gaps.

2. `<path/to/architect-agent.agent.md>`
**Purpose:** Owns system-level technical decisions and project boundaries.

3. `<path/to/development-agent.agent.md>`
**Purpose:** Builds features according to architectural blueprints.

## Generated Required Agent Matrix

| Agent Path | Source | Reason Selected | Required Tools | Applies To |
|---|---|---|---|---|
| .github/agents/agents-orchestrator.agent.md | local | workflow control | core tools | all |
| <path/to/selected-agent.agent.md> | awesome-copilot | matched repo capabilities | <tool names> | <profile(s)> |

## Excluded Candidates (With Reason)

| Agent Path | Reason Excluded |
|---|---|
| <path/to/agent.agent.md> | missing required tool / irrelevant profile / conflict |
