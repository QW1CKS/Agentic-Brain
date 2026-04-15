# Product Requirements Document (PRD)

## 1. Project Overview
- **Name:** `<Project Name>`
- **Description:** `<One paragraph elevator pitch of what this product solves and what it is>`
- **Target Audience:** `<Who are the intended users?>`

## 2. Goals & Success Metrics
- **Goals:** `<What business/technical realities define success?>`
- **KPIs:** `<Measurable metrics e.g. Handle 10,000 req/sec, <200ms TTFB>`

## 3. Product Scope
### 3.1 In Scope
- `<Feature 1, e.g., Authenticated user session sharing>`
- `<Feature 2, e.g., Admin dashboard with basic CRUD operations>`
- `<Feature 3, e.g., Notification system>`

### 3.2 Out of Scope (V2+)
- `<Feature to defer, e.g., Payment integrations>`
- `<Feature to defer, e.g., Advanced AI analytics>`

## 4. User Personas & Workflows
### Personas
- **P1:** `<Admin User>`
- **P2:** `<End User>`

### Workflows
- **As an `<End User>`**, I want `<to sign up quickly>` so that `<I can immediately access the service>`.
  - *Flow:* Splash Screen -> Registration Form -> OAuth -> Main Dashboard.

## 5. Technical Architecture
- **Frontend App:** `<e.g., React Native/Expo, NextJS>`
- **Backend Services:** `<e.g., Firebase Serverless, Express REST API>`
- **Database Architecture:** `<e.g., NoSQL Firestore, PostgreSQL>`
- **Security:** `<Authentication mechanism, rule enforcements>`

## 5.1 Repository Metadata (Machine-Readable)
- **Repo Profile:** `<auto | frontend | backend | fullstack | data | infra>`
- **Primary Language:** `<typescript | python | go | java | rust | other>`
- **Frameworks:** `<comma-separated list>`
- **Package Manager:** `<npm | pnpm | yarn | pip | poetry | uv | maven | gradle | go>`
- **Runtime:** `<node | python | jvm | go | mixed>`
- **CI Platform:** `<github-actions | azure-devops | gitlab | none>`

### 5.1.1 Validation Commands
- **Build Command:** `<e.g., pnpm build>`
- **Test Command:** `<e.g., pnpm test>`
- **Lint Command:** `<e.g., pnpm lint>`
- **Smoke Command:** `<optional quick verification command>`

### 5.1.2 Source-of-Truth Paths
- **App Paths:** `<src/, apps/, services/>`
- **Infra Paths:** `<infra/, terraform/, bicep/>`
- **Data Paths:** `<notebooks/, data/, pipelines/>`
- **Docs Paths:** `<docs/, ADR paths>`

## 6. Phase Breakdown (for Agentic Workflow)
*Map these logically so the Agents Orchestrator knows what to plan.*

- **Phase 1: Foundation:** `<Monorepo setup, auth loops, basic routing>`
- **Phase 2: Core Domain Models:** `<Data schemas and API boilerplate>`
- **Phase 3: Core MVP Features:** `<The central logic loops>`
- **Phase 4: Design & Refinement:** `<Polishing UI/UX across breakpoints>`
- **Phase 5: Launch:** `<Environment deployments, final security audits>`

## 6.1 Phase Adaptation Rules
- **Skip Phases:** `<phase IDs to skip for this repo>`
- **Merge Phases:** `<pairs to merge when practical>`
- **Custom Sequence:** `<explicit phase order if not linear>`

## 6.2 Exit Validation Contract
- Each phase must define:
  - required artifacts,
  - verification commands,
  - evidence links into `.github/agent_memory/03_actions.md`.

## 7. Awesome-Copilot Curation Inputs
- **Import Mode:** `<install-everything | curated-only | hybrid>`
- **Required Capabilities:** `<security, testing, performance, docs, infra, data, uiux ...>`
- **Tool Constraints:** `<allowed/disallowed MCPs or integrations>`
- **Risk Posture:** `<strict | balanced | exploratory>`

## 8. Persistent Memory Policy
- **Memory Location:** `.github/agent_memory/`
- **Log Strategy:** `append-only`
- **Retention:** `<archive policy, e.g. quarterly snapshots>`
- **Linking Rule:** `every checklist completion must reference at least one memory entry`
