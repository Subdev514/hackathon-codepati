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

## Knowledge layer, discovery and workflow intelligence

Campus OS now extends the local graph into a knowledge/workflow layer:

- **Knowledge** — natural-language discovery across authorized campus knowledge, with graph expansion and profile-aware ranking rather than only literal feed search.
- **Notion integration** — the Vercel server boundary can bootstrap Campus OS Knowledge, Tasks and Opportunities databases and sync records without exposing a Notion token to the browser. Configure `NOTION_TOKEN` and `NOTION_PARENT_PAGE_ID` on the deployment to activate it; otherwise the UI stays explicitly disconnected.
- **Notion mirrored tables** — only `NOTION_TOKEN` is required. Campus OS creates and maintains seven Notion pages, each holding one table:
  - **Campus OS · Upcoming Events**: every event registered on the Events page with status *upcoming* or *in progress*. Columns: Event, Society, Date, Nature / Highlight, Special Guests, Progress, Venue, Status.
  - **Campus OS · Feedback**: every feedback record submitted on the Feedback page. Columns: Feedback, Event, Society, Category, Sentiment, Priority, Submitted By, Submitted At.
  - **Campus OS · Resource Tracker**: every resource tracked in Society Ops. Columns: Resource, Event, Society, Event Date, Category, Quantity, Owner, Status.
  - **Campus OS · Guest Management**: every event guest. Columns: Guest, Designation, Event, Society, Event Date, Role, Status, Host, Arrival, Needs, Honorarium.
  - **Campus OS · Budget Tracker**: every budget line item. Columns: Line Item, Event, Society, Type (expense/income), Category, Planned, Actual, Status, Owner.
  - **Campus OS · Society Polls**: every society poll with live results. Columns: Question, Society, Event, Status, Results, Leading Option, Votes, Closes, Created By.
  - **Campus OS · Conflicts**: the conflicts Campus OS currently detects. A row is trashed once its conflict is resolved. Columns: Conflict, Type, Severity, Details, Events, Societies, Source.

  **Notion as a shared calendar:** rows added by hand to the Upcoming Events table (rows with no Campus OS ID) are read back and checked for venue and same-day clashes with Campus OS events. Society Ops → Conflicts shows them and can re-check on demand.

  **Where the pages go:** under `NOTION_PARENT_PAGE_ID` if it is set and reachable. Otherwise at the workspace top level, which works for personal access tokens and public connections. Otherwise under any page shared with the integration. An *internal* integration cannot create workspace-level pages, so connect it to at least one page (••• → Connections).

  **Each sync:** finds the existing page by title instead of creating duplicates. Adds missing columns, fixes wrong column types and renames the title column. Then creates, updates or trashes rows. Rows added by hand in Notion are left untouched.

  **Fixed tables (optional):** set `NOTION_EVENTS_DATA_SOURCE_ID`, `NOTION_FEEDBACK_DATA_SOURCE_ID`, `NOTION_RESOURCES_DATA_SOURCE_ID`, `NOTION_GUESTS_DATA_SOURCE_ID`, `NOTION_BUDGET_DATA_SOURCE_ID`, `NOTION_POLLS_DATA_SOURCE_ID` or `NOTION_CONFLICTS_DATA_SOURCE_ID`.

- **Society Ops** — each private society workspace has three views:
  - **Event Ops**: tasks, guest management (role, status, host, arrival, needs, honorarium), a resource tracker with editable status, and a budget tracker with an approved cap and planned and actual line items.
  - **Polls**: members vote (one ballot each, changeable), and society leads and admins publish, close and reopen polls.
  - **Conflicts**: venue double-bookings (including the Notion calendar), same-day clashes, guests booked twice or unconfirmed within 14 days, members with tasks for different events due the same day, shared equipment clashes, resources unconfirmed within 7 days, and spending over the cap.

  **Local development:** `npm run dev` serves `/api/notion` itself and reads these variables from `.env`.
- **Personalized workflow** — relevant opportunities can be saved, deadline reminders created and suggested actions promoted into tasks/project actions.
- **Dependencies** — explicit registration, volunteer and project-milestone relationships are represented in the graph and surfaced in Network.
- **Roles** — Student and Club Coordinator contexts change the operational experience and Notion synchronization permission.
- **Analytics** — pending registrations, upcoming deadlines, participation, workload and project progress are derived from the same domain state.

The Notion integration uses the official Notion API from the server-side `api/notion.js` function. The deterministic discovery engine is intentionally graph-grounded for the current MVP and does not claim an external LLM connection.
