# Memory Health

## Memory Health Template
- **Checked At:** <YYYY-MM-DDTHH:MM:SSZ>
- **Checked By:** <agent path>
- **Broken Links:** <count>
- **Duplicate IDs:** <count>
- **Orphan Entries:** <count>
- **Notes:** <summary>

## Validation Checklist
- [ ] No broken links between 00-06 memory files.
- [ ] No duplicate DEC/LEA/BLK IDs in markdown memory files.
- [ ] `03_actions.tsv` and `05_handoffs.tsv` remained append-only.
- [ ] `03_actions.tsv` and `05_handoffs.tsv` remain tab-separated with one row per line.
- [ ] If either TSV file exceeds 100 lines, a memory compression task recommendation was created.
- [ ] Active blockers in `04_blockers.md` referenced by checklist when relevant.
