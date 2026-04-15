# Second Brain Index

This folder is the repo-local memory graph.

## Table of Contents
- [Decisions](./01_decisions.md#memory-graph-contract)
- [Learnings](./02_learnings.md#pre-flight-and-write-after-action)
- [Actions](./03_actions.md#action-log-template)
- [Blockers](./04_blockers.md#blocker-log-template)
- [Handoffs](./05_handoffs.log)
- [Memory Health](./06_memory_health.md#memory-health-template)

## How to Use
- Read this file first.
- Keep new entries short, concrete, and cross-linked.
- Prefer relative links between related entries.

## Immutable Logging Policy
- `03_actions.md` and `05_handoffs.log` are append-only.
- Never delete historical entries.
- If a correction is needed, append a new entry referencing the prior entry ID.

## Entry ID Format
- Decisions: `DEC-YYYYMMDD-XXX`
- Learnings: `LEA-YYYYMMDD-XXX`
- Actions: `ACT-YYYYMMDD-XXX`
- Blockers: `BLK-YYYYMMDD-XXX`
- Handoffs: `HO-YYYYMMDD-XXX`
