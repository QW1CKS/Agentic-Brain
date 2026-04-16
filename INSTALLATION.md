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

## Three-Phase Installation

Agentic Brain uses a three-phase installation to ensure proper curation of agents, instructions, and hooks based on your specific project needs.

### ⚠️ CRITICAL: Where to Install

**Agentic Brain must be installed INTO YOUR ACTUAL PROJECT REPOSITORY, NOT into the Agentic Brain template folder itself.**

- ❌ WRONG: Running script inside `Agentic-Brain/` folder
- ✅ CORRECT: Running script from your project folder, targeting your project

For example, if your project is at `C:\Users\user\Desktop\my-chrome-extension`, you run the scaffolding there - NOT inside the Agentic-Brain folder.

### Phase 1: Scaffolding

In a target repository (NOT in the Agentic Brain template folder), ask Copilot:
- "Install Agentic Brain for this repository."

**What happens:**
1. Copilot runs `scripts/scaffold-agentic-brain.mjs` which creates:
   - `.github/copilot-instructions.md` (critical - loaded by every agent)
   - `.github/agent_memory/` (memory templates: 00_index.md, 01_decisions.md, etc.)
   - `.github/agentic_brain/` (empty folders for catalog and vendor assets)
   - `.github/agents/` (empty - will be populated by installer)
   - `.github/hooks/` (empty - will be populated by installer)
   - `.github/workflows/` (empty - will be populated by installer)
   - `.github/skills/` (empty - will be populated by installer)
   - `AGENTS/` (placeholder phases: Active Phase, Progress Dashboard, phase folders)
   - `PRD_TEMPLATE.md` (will be filled in detail by installer)
2. Copilot tells you to **switch to "Copilot Agentic Brain Installer"** agent
3. **Do NOT work in the Agentic Brain template folder** - this scaffolding goes in your actual project repo

### Phase 2: PRD & Phase Configuration

After switching to "Copilot Agentic Brain Installer" agent, provide your project idea/need:
- What is your project called?
- What problem does it solve?
- Who is the target audience?
- What type of application (frontend, backend, mobile, etc.)?
- Any specific technologies?

**The installer will then:**
1. Write a detailed PRD based on your idea
2. **Copy this agent to `.github/agents/agentic-brain-installer.agent.md`** (CRITICAL - makes it available for future sessions)
3. Detect your repository profile (frontend/backend/fullstack/data/infra)
4. Define phase structure based on PRD
5. Configure each phase with README and checklist
6. Update memory index and progress dashboard

### Phase 3: Asset Selection & Import (Asset Curator Agent)

**This phase is handled by a specialized Asset Curator agent:**

1. The installer copies the Asset Curator agent to `.github/agents/`
2. User switches to "Agentic Brain Asset Curator" agent
3. The Asset Curator:
   - Reads PRD.md to understand project requirements
   - Analyzes tech stack and determines needed agent categories
   - Browses awesome-copilot vendor folder
   - Selects appropriate agents, hooks, workflows, skills
   - Copies to CORRECT VSCode-mandated locations:
     - Agents → `.github/agents/`
     - Hooks → `.github/hooks/`
     - Workflows → `.github/workflows/`
     - Skills → `.github/skills/`
   - Updates phase documentation with selections

**⚠️ IMPORTANT: Use the specialized Asset Curator agent for this phase.**

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
