# Campus OS

Campus OS is a hackathon MVP for turning fragmented campus information into connected, personalized workflows.

The product loop is:

Campus information → structured entities → relationships → personalization → tasks/actions

## What is working

- Reddit-style campus discovery feed
- Create Announcement flow
- Deterministic extraction of events, opportunities, organizers, dates, deadlines, requirements and team constraints
- “Campus OS understood this” preview with confidence and extraction reasons
- Relationship graph backed by domain state
- Generated tasks linked to their source entity
- Graph-grounded Campus Copilot for tasks, deadlines, events and personalized signals
- Explicit Vercel configuration for the Vite production build
- Task completion and workflow progress
- LocalStorage persistence across reloads
- Explainable “For You” relevance based on student profile
- Responsive UI with animated spatial terrain and relationship graph
- Reduced-motion support for accessibility
- Vitest extraction/commit tests
- Vite production build configuration

## Demo

Use the primary `+ Create` action and paste:

> AI Club is conducting a 24-hour hackathon on October 15. Teams of 2–4 can participate. Registration closes October 10. Participants need to submit their idea before October 13.

Then show:

1. Understanding preview
2. Event + club + deadline + team relationships
3. Generated tasks
4. Confirm & connect
5. Workflow progress
6. Campus graph
7. Campus Copilot answers a workflow/deadline question from the graph
8. For You relevance reasons

The key story is:

POST → UNDERSTOOD → CONNECTED → ACTIONABLE

## Architecture

UI
→ domain services
→ local store
→ localStorage

`src/domain.ts` contains the domain model, store boundary, extraction engine, workflow generation and relevance logic. React components do not own the campus graph.

The deterministic extractor is deliberately provider-independent. An external AI provider can later implement the same extraction contract without replacing the product workflow.

## Development

```bash
npm install
npm run dev
npm test
npm run build
```

## Scope

This repository is optimized for the hackathon demonstration rather than production infrastructure. Authentication, campus isolation, backend synchronization and external AI can be added after the core product loop is stable.


## Society operations workspace

Campus OS now includes Notion-style structured workspaces for campus societies:

- **Events** — public event database with society, date, nature/highlight, special guests, progress, venue, deadline and eligibility.
- **Society Ops** — private society workspace with event task assignments, member/lead status, contribution tracking, budgets, sponsorships, promotion and resource/requirement tracking.
- **Post-event analysis** — registrations, attendance, winners, participant/guest feedback, what went well, problems, suggestions, final expenditure, photos, sponsors and an event report.
- **Feedback** — categorical feedback by event and category, with priority/sentiment and organizer summaries.

The current implementation is local-first. Private society access is enforced by the application domain model in the browser for the MVP; it is **not** a server-side security boundary. A production deployment must add authenticated identity, server-side authorization, campus/society isolation and synchronized persistence before treating private pages as secure multi-user data.


## Deployment readiness

Campus OS is a Vite static web application and is deployment-ready on any static host that runs npm install and npm run build and serves dist/. Vercel can deploy the repository directly with the default Vite detection; no backend is required for the current offline-first MVP. The application keeps campus state in browser localStorage, so a future shared deployment should add a backend implementation of the CampusRepository contract before claiming multi-user synchronization.

For a hackathon demo, use the main branch, open the deployed site, click + Create, run the announcement understanding flow, and use Network, For You, and My Tasks to demonstrate the connected loop. The profile menu also contains Reset demo for a clean presentation state.

## Campus Copilot

Campus Copilot is currently graph-grounded and deterministic. It answers questions from the stored campus entities, relationships, deadlines, tasks and editable profile. It deliberately does not invent facts or call an external model. This keeps the product useful offline while preserving a clean path for a future server-side AI provider.

Example questions:

- What do I need to do for the hackathon?
- What is the hackathon registration deadline?
- What events are happening?
- What is relevant to me?

## Deployment

The repository includes `vercel.json` with the Vite build command and `dist/` output directory. Vercel can deploy the main branch directly. The current redesign is dependency-light and uses CSS/DOM motion rather than requiring a WebGL runtime. The current application is still local-first: each browser has its own campus state and profile. A shared multi-user deployment must not be represented as synchronized until a backend repository implementation is added.


## Public society pages

Campus OS includes a public-facing society system separate from private Society Ops.

Each society profile contains:
- Society name, FIC and genre
- X-Factor profile statement
- Significant contribution/change timeline
- Public member roster with positions
- Upcoming society-authored event posts
- Collaborating societies
- Optional event description and registration link
- Prizes, special guests, join reason and event X-Factor
- Past event archive with winners and media

Private operational data such as internal tasks, budgets, promotion work and requirements remains in the Society Ops workspace rather than the public profile.

