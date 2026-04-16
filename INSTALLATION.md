# Agentic Brain Installation Guide

## Related Docs

- Overview: [README.md](README.md)
- Product requirements template: [PRD_TEMPLATE.md](PRD_TEMPLATE.md)
- Universal execution protocol: [prompt.md](prompt.md)
- Copilot workflow contract template: [.github_templates/copilot-instructions.md](.github_templates/copilot-instructions.md)
- Active phase state template: [AGENTS_templates/ACTIVE_PHASE.md](AGENTS_templates/ACTIVE_PHASE.md)
- Progress dashboard template: [AGENTS_templates/PROGRESS_DASHBOARD.md](AGENTS_templates/PROGRESS_DASHBOARD.md)
- Phase README template: [AGENTS_templates/PHASE_TEMPLATE/README.md](AGENTS_templates/PHASE_TEMPLATE/README.md)
- Phase checklist template: [AGENTS_templates/PHASE_TEMPLATE/CHECKLIST.md](AGENTS_templates/PHASE_TEMPLATE/CHECKLIST.md)

## Two-Phase Installation

Agentic Brain uses a two-phase installation to ensure proper curation of agents, instructions, and hooks based on your specific project needs.

### Phase 1: Scaffolding

In a target repository (NOT in the Agentic Brain template folder), ask Copilot:
- "Install Agentic Brain for this repository."

**What happens:**
1. Copilot runs `scripts/scaffold-agentic-brain.mjs` which creates:
   - `.github/copilot-instructions.md` (critical - loaded by every agent)
   - `.github/agent_memory/` (memory templates: 00_index.md, 01_decisions.md, etc.)
   - `.github/agentic_brain/` (empty folders for catalog and vendor assets)
   - `.github/agents/` (empty - will be populated by installer)
   - `AGENTS/` (placeholder phases: Active Phase, Progress Dashboard, phase folders)
   - `PRD_TEMPLATE.md` (will be filled in detail by installer)
2. Copilot tells you to **switch to "Copilot Agentic Brain Installer"** agent
3. **Do NOT work in the Agentic Brain template folder** - this scaffolding goes in your actual project repo

### Phase 2: Full Curated Installation

After switching to "Copilot Agentic Brain Installer" agent, provide your project idea/need:
- What is your project called?
- What problem does it solve?
- Who is the target audience?
- What type of application (frontend, backend, mobile, etc.)?
- Any specific technologies?

**The installer will then:**
1. Write a detailed PRD based on your idea
2. Detect your repository profile (frontend/backend/fullstack/data/infra)
3. **Curate agents** from awesome-copilot-main (NOT pre-set - picked fresh for your project)
4. Curate instructions, hooks, workflows as needed
5. Configure phases with detailed documentation
6. Update all memory files
7. Run a consistency sweep for errors and broken links
8. Continue until complete - only stops on blockers needing your input

## Script Install

If you prefer to run the scaffolding manually, run from this template root:

```powershell
node .\scripts\scaffold-agentic-brain.mjs --target "C:\path\to\repo"
```

This creates the basic folder structure. Then switch to Copilot Agentic Brain Installer for full configuration.

## Validation

```powershell
npm run memory:validate -- --target "C:\path\to\repo"
```

## Outputs to Check

- `.github/agentic_brain/catalog/awesome-catalog.yaml`
- `.github/agentic_brain/catalog/required-assets.yaml`
- `.github/agentic_brain/install-report.json`
- `.github/agent_memory/00_index.md`
- `.github/agent_memory/03_actions.tsv`
- `.github/agent_memory/05_handoffs.tsv`

Return to overview: [README.md](README.md)
