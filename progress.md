# Campus OS — Project Brain

Last updated: 2026-10-02 — CP11 roadmap added
Repository: sarkarshivaditya-lab/for-friends
Status: Active autonomous hackathon build

## 1. Product definition

Campus OS is a Campus Operating System, not a Reddit clone.

Core loop:
Campus information → structured entities → relationships/context → personalization → tasks/workflows → reminders/actions.

The feed is an input/discovery surface. The product differentiator is understanding campus information as connected objects and converting that understanding into useful work.

## 2. Execution contract

This file is the execution state for the project.

Autonomous work loop:
1. Read this file before architectural changes.
2. Identify the highest-priority incomplete checkpoint.
3. Implement that checkpoint as a working vertical slice.
4. Verify the change where tooling permits.
5. Update this file immediately with the result, tests, decisions, bugs and next checkpoint.
6. Read this file again.
7. Continue to the next incomplete checkpoint without waiting for user approval.
8. Stop only when all planned MVP checkpoints are complete or a genuine blocker requires user input.

Never treat the repository as fresh. Preserve working behavior unless replacement is necessary.

## 3. Hackathon scope

The judge should understand within two minutes:
1. A messy campus announcement enters Campus OS.
2. The system understands the announcement.
3. Entities, deadlines and relationships are preserved.
4. User context changes relevance.
5. The system produces concrete next actions.
6. Completing an action updates the user's workflow.

Do not spend time on:
- karma/moderation/social complexity
- premature microservices
- production-scale infrastructure
- elaborate authentication
- features that do not strengthen the core loop

## 4. Checkpoint roadmap

### CP0 — Foundation and project brain
Status: COMPLETE
- Vite + React + TypeScript application
- Responsive Campus OS UI
- Domain types extracted from UI
- progress.md execution brain

### CP1 — Local domain/store boundary
Status: COMPLETE
Goal: make entities, posts, relationships and tasks mutable through a small application store rather than hard-coded UI data.
Acceptance:
- one store/service owns current campus state
- UI can add entities/posts/tasks/relationships through service functions
- initial demo data still renders

### CP2 — Announcement ingestion
Status: COMPLETE
Goal: user can paste/write a campus announcement and submit it.
Acceptance:
- Create Announcement action visible from primary UI
- announcement form captures title/body/type/source
- submitted text reaches domain service

### CP3 — Deterministic extraction engine
Status: COMPLETE
Goal: turn common campus announcement language into structured facts without requiring an external API key.
Acceptance:
- extracts likely event/opportunity/resource
- extracts organizer
- extracts dates/deadlines
- extracts team/participation constraints
- preserves source text
- returns confidence/reason fields
- handles the hackathon demo announcement

### CP4 — Understanding preview
Status: COMPLETE
Goal: show the user what Campus OS understood before committing.
Acceptance:
- extracted entities shown as cards/chips
- relationships shown explicitly
- deadlines and requirements visible
- generated tasks previewed
- user can confirm or edit basic extracted fields

### CP5 — Commit graph + workflow
Status: COMPLETE
Goal: confirmed announcement becomes real campus state.
Acceptance:
- creates post/entity/relationships
- creates derived deadlines and tasks
- tasks retain source entity/reason
- graph and workflow views reflect newly ingested data

### CP6 — Persistence
Status: COMPLETE
Goal: refresh-safe local MVP.
Acceptance:
- domain state survives reload using localStorage
- safe hydration/fallback to demo data
- no loss when schema evolves

### CP7 — Personalization
Status: COMPLETE
Goal: demonstrate why the same campus graph becomes a personalized OS.
Acceptance:
- local demo user profile has branch/year/interests/clubs
- relevance score/reason is transparent
- feed/workflow can surface relevant items with reasons
- no opaque recommendation claims

### CP8 — Product loop polish
Status: COMPLETE
Goal: make the full POST → UNDERSTOOD → CONNECTED → ACTIONABLE flow obvious.
Acceptance:
- clear transitions/status labels
- announcement detail opens its relationships
- task completion updates progress
- empty/error states are intentional
- mobile layout remains usable

### CP9 — Verification and demo hardening
Status: COMPLETE
Goal: verify build and core user journey.
Acceptance:
- production build passes
- core parser cases pass
- no obvious TypeScript/runtime errors
- README and progress reflect actual architecture
- final demo path is documented

### CP10 — Post-MVP product expansion
Status: COMPLETE
Execution order is fixed and each sub-checkpoint must be completed, verified, recorded here, then reread before moving on.

#### CP10A — AI-ready understanding boundary
Status: COMPLETE
- Define provider interface around ExtractedAnnouncement.
- Add strict validation/normalization and deterministic fallback.
- Keep secrets out of the browser; no client-side API key.
- Added ExtractionProvider, deterministicExtractionProvider, normalizeExtraction and validateExtraction in src/domain.ts.
- commitExtraction now rejects malformed extraction results before mutating campus state.
- Added provider-boundary tests for normalization, validation and async provider execution.
- Verification: source-level contract/test review completed; local npm execution remains blocked by unavailable outbound network.

#### CP10B — Interactive relationship graph
Status: COMPLETE
- Make graph nodes real selectable campus entities.
- Show connected relationships, source context and actions for the selected node.
- Preserve the existing graph demo as the default view.
- Network now supports selectable entity nodes and entity filter chips.
- Selected entities expose connected relationships, source announcement context and generated actions.
- Added graph control styling without changing the underlying domain model.
- Verification: source-level UI/state review completed.

#### CP10C — Broader campus information types
Status: COMPLETE
- Support event, opportunity, resource, notice, competition, project and deadline-oriented announcements.
- Preserve first-class entities/relationships for each type.
- Add representative demo/test cases.
- Added first-class notice and competition entity types; resource/project types were already present and are now produced by extraction.
- Create Announcement now exposes EVENT, OPPORTUNITY, RESOURCE, NOTICE, COMPETITION and PROJECT.
- Added extraction tests for resource, notice and competition inputs plus deadline relationships.
- Verification: source-level type/extraction/test review completed.

#### CP10D — Personal campus workspace
Status: COMPLETE
- Make the profile editable locally.
- Store branch, year, interests, clubs and active projects.
- Recompute relevance and workflow presentation from profile state.
- Added local profile persistence with name, branch, year, interests, clubs and active projects.
- Added editable profile modal from the sidebar and wired For You relevance to the current profile.
- Added active-project relevance reasons.
- Verification: source-level UI/domain/test review completed.

#### CP10E — Deadline intelligence
Status: COMPLETE
- Surface upcoming, due-soon and overdue deadlines.
- Connect deadlines to their originating event/opportunity and generated task.
- Add a compact timeline/attention view.
- Added deadlineStatus() and campusDeadlines() domain services.
- Home now surfaces connected deadlines as upcoming, due-soon, today or overdue and links each deadline to its source entity and open task when available.
- Added deterministic deadline-status tests.
- Verification: source-level domain/UI/test review completed.

#### CP10F — Backend-ready multi-user boundary
Status: COMPLETE
- Separate local domain contract from persistence implementation.
- Define a backend synchronization seam without breaking offline-first behavior.
- Keep authentication/campus isolation as an integration boundary rather than a rewrite.
- Added CampusPersistence and CampusRepository contracts plus a local persistence adapter.
- Application startup and mutations now use the repository boundary instead of coupling UI code directly to localStorage.
- Added a swappable persistence test proving domain consumers do not depend on the storage implementation.
- Verification: source-level architecture/test review completed.

#### CP10G — Hackathon polish and deployment readiness
Status: COMPLETE
- Add reset/demo controls and intentional loading/empty/error states.
- Improve graph presentation and demo reliability.
- Verify production build and document deployment path if tooling permits.
- Added visible extraction/commit error handling, intentional search empty states and a Reset demo recovery action.
- Hardened persisted numeric IDs to continue above existing state and deduplicated generated tasks by title/source.
- Added state-hardening tests for ID allocation and duplicate task prevention.
- Documented Vite/Vercel/static-host deployment readiness in README.
- GitHub workflow-run lookup for the latest commit returned no runs; production build could not be executed locally because outbound package/network access is unavailable. Source-level verification completed.

Completion rule: do not mark CP10 complete until CP10A–CP10G are complete or a concrete external blocker is documented.

## 14. Next-phase roadmap — CP11

### CP11A — Graph/workflow integrity
Status: COMPLETE
Goal: make every generated task and deadline resolve to a real source entity consistently.
Acceptance:
- generated tasks use canonical entity IDs
- graph actions resolve for both seeded and generated data
- deadline cards resolve their originating entity/task
- regression tests cover the source-link contract
- Seed workflow tasks now use canonical entity IDs. Graph action lookup now resolves tasks by entity ID. Added regression coverage for seeded and generated task source integrity.

### CP11B — Campus Copilot
Status: COMPLETE
Goal: let a student ask natural-language questions about their campus workflow using the existing graph and profile context.
Acceptance:
- deterministic local query engine works without an API key
- answers cite connected campus entities, deadlines and tasks
- profile context can change the answer
- no fabricated campus facts
- AI can later replace the query engine behind a clean provider boundary
- Added answerCampusQuery() with graph-grounded task, deadline, event and profile-relevance queries.
- Added a Home Campus Copilot panel that clearly states answers are limited to stored campus state.

### CP11C — Demo-grade interaction polish
Status: COMPLETE
Goal: make the two-minute judge journey unmistakable and remove remaining hardcoded demo assumptions.
Acceptance:
- home greeting uses the editable profile
- generated tasks open their source context
- announcement → understanding → connection → action has explicit visual state
- reset/demo behavior is predictable
- no known UI/runtime consistency defects
- Home greeting now follows the editable profile.
- My Tasks context panel now derives task/source relationships from canonical state instead of hardcoded hackathon examples.
- Reset demo now resets both campus data and the local profile.

### CP11D — Public deployment and verification
Status: IN PROGRESS
Goal: make the current build demonstrable outside the development machine.
Acceptance:
- deployment configuration is documented and compatible with Vite
- production build remains green after CP11 changes
- final README demo path matches actual product behavior
- deployed environment does not claim multi-user synchronization without a backend
- Added vercel.json with explicit Vite build/output configuration.
- README now documents Campus Copilot and the local-first deployment boundary.

Execution order: CP11A → CP11B → CP11C → CP11D. After each checkpoint, update this file, reread it, then continue.

## 5. Current architecture

UI
→ application/domain services
→ local store
→ optional persistence
→ optional external AI/API

Current technology:
- React
- TypeScript
- Vite
- CSS
- GitHub repository

The domain layer should not depend on React.

## 6. Domain model

Primary entities:
User, Person, Club, Organization, Event, Opportunity, Project, Task, Deadline, Resource, Post.

Relationships:
member_of, organizes, has_deadline, requires, derived_from, references, interested_in, uses, assigned_to, participates_in.

Important rule: deadlines and requirements are first-class objects, not merely strings inside posts.

## 7. Extraction target

Input example:
“AI Club is conducting a 24-hour hackathon on October 15. Teams of 2–4 can participate. Registration closes October 10. Participants need to submit their idea before October 13.”

Expected understanding:
- Event: AI Hackathon
- Organizer: AI Club
- Event date: October 15
- Team size: 2–4
- Registration deadline: October 10
- Idea submission deadline: October 13
- Tasks: find teammates, register, prepare idea, submit idea

Every generated item must retain source/context.

## 8. Personalization target

Demo profile:
- branch/year
- interests
- clubs
- active projects
- current tasks

Personalization affects relevance and surfaced actions, but reasons remain visible.

## 9. Preferred demo storyline

1. Open Campus OS.
2. Show mixed campus feed.
3. Click Create Announcement.
4. Paste a messy announcement.
5. Show “Campus OS understood this”.
6. Show entities + relationships + deadlines.
7. Confirm.
8. Show new item in feed and graph.
9. Show generated workflow.
10. Complete one task.
11. Explain that the same graph can ingest events, opportunities, notices, resources and projects.

## 10. Known risks

- No backend yet.
- External AI is intentionally deferred until the deterministic vertical slice works.
- Authentication/campus isolation is out of hackathon MVP scope.
- Graph visualization is currently partly presentation-oriented.
- Build/runtime verification must be completed before final demo.

## 11. Change log

### 2026-10-02 — Initial MVP
- Bootstrapped Vite + React + TypeScript.
- Created campus feed, workflow, tasks, graph, navigation and responsive styling.
- Added README and project brain.

### 2026-10-02 — Domain layer
- Added typed campus entities, relationships, posts and tasks in src/domain.ts.
- Moved demo data out of the UI.
- Added deterministic workflow service seam.
- UI behavior remained unchanged.
- Build/tests had not yet been executed in a local runtime.

### 2026-10-02 — Autonomous roadmap
- Replaced the short immediate-priority list with explicit checkpoints CP0–CP10.
- Added an execution contract requiring reread → implement → verify → update → reread → continue.
- Defined acceptance criteria for the complete hackathon MVP.
- Marked CP1 as the active checkpoint.

### 2026-10-02 — CP1/CP3 domain engine
- Added a mutable application store boundary in src/domain.ts for posts, entities, relationships and tasks.
- Expanded relationship/entity types so assigned_to and participates_in can be represented.
- Added AnnouncementInput and ExtractedAnnouncement contracts.
- Added a deterministic announcement extraction engine covering event/opportunity detection, organizers, dates, deadlines, team constraints and requirements.
- Added commitExtraction() to convert an accepted extraction into campus state.
- Kept extraction provider-independent so an external AI provider can be added later without changing the UI contract.
- Verification: static review completed; browser/build verification still pending.
- Active checkpoint remains CP2 because the UI ingestion flow is the next incomplete vertical slice.

## 12. Current execution state

Superseded by the final execution state below.


### 2026-10-02 — CP2/CP4/CP5 announcement vertical slice
- Added Create Announcement modal with title, type, source and raw announcement body.
- Added “Understand this announcement” preview before committing data.
- Preview exposes extracted entities, relationships, deadlines, requirements, confidence/reasons and generated tasks.
- Confirming an announcement commits a new post, entities, relationships and tasks into the domain store.
- Relationship view now reads from the domain state instead of fixed graph labels.
- Workflow task completion now mutates the shared domain store and refreshes the UI.
- Verification: static review completed; CSS/build/browser verification still pending.


### 2026-10-02 — CP6 persistence foundation
- Added versioned localStorage key and safe load/save helpers to the domain layer.
- Invalid or unavailable stored state falls back to the seeded demo state.
- Persistence is browser-only and does not leak storage concerns into React components beyond startup/mutation wiring.
- Verification: static review completed; build/browser verification still pending.


### 2026-10-02 — CP7 relevance model
- Added a demo UserProfile and relevanceForUser() domain service.
- Relevance is intentionally explainable: interest matches, followed-club matches and year-aware opportunity relevance each expose a reason.
- No opaque recommendation score is presented to the user.
- Verification: static review completed; build/browser verification still pending.


### 2026-10-02 — CP6/CP7 application integration
- Application startup now hydrates the domain store from localStorage.
- Store mutations save the current state, making accepted announcements and task completion reload-safe.
- Added transparent “For You” relevance view using branch/year/interests/clubs context and human-readable reasons.
- Added responsive styles for the full announcement understanding flow.
- Verification: static review completed; automated build/browser verification still pending.

### 2026-10-02 — CP9 verification setup
- Added Vitest and npm test script.
- Added src/domain.test.ts covering hackathon extraction and commit deduplication.
- Local runtime could not be used because outbound GitHub access is unavailable in the execution container; repository-side CI will be used for build/test verification.
- Next action: add CI workflow, then inspect its result before declaring verification complete.

### 2026-10-02 — CP8 product polish / CP9 verification infrastructure
- Added responsive modal, extraction chips, relationship rows, confidence indicator, workflow preview and transparent relevance presentation.
- Updated README with the real architecture, demo sequence and current scope.
- Added GitHub Actions workflow to run npm test and npm run build on main/PR changes.
- The GitHub connector exposes no push-triggered workflow-run listing for this repository, so CI execution cannot yet be independently observed through the available connector.
- Local container verification is blocked by unavailable outbound GitHub DNS/network access.
- No deployment or external AI integration has been added; those remain optional after the core MVP.


## CP12 — Society Operations / Notion-style workspace
Status: IN PROGRESS
Requirement source: user-requested Notion-page workflow for events, private society operations, post-event analysis and categorical feedback.

Execution order:
1. CP12A — Events database
   - Add a dedicated Events workspace/table with upcoming event name, hosting society, date, nature/highlight, special guests, progress, venue, deadline and eligibility.
   - Support local CRUD through the domain boundary.
   - Add status/progress presentation and deadline visibility.
2. CP12B — Private Society Operations page
   - Add a society-specific private workspace separate from the public event index.
   - Add event task tracking with assignee/member/lead and pending/done state.
   - Add contribution tracking, budget tracking, promotion tracking and resource/requirement tracking.
   - Gate the private workspace behind an explicit local access-control model compatible with future authenticated backend enforcement.
3. CP12C — Post-event analysis
   - Add registrations, attendance, winners, participant/guest feedback, successes, problems, suggestions, final expenditure, photos, sponsors and event report.
   - Link each analysis record to its event.
4. CP12D — Categorical feedback/suggestions
   - Add category, sentiment/priority, text, submitter and event/society context.
   - Add aggregate category views.
5. CP12E — Navigation, mobile UI and verification
   - Add clear public/private navigation.
   - Keep new tables usable on mobile.
   - Add domain regression tests and update README.
   - Run available verification or document the exact external blocker.

Design decisions:
- Keep the existing local-first Campus OS architecture; no backend rewrite.
- “Notion-style” means structured editable pages/databases inside Campus OS, not a dependency on Notion itself.
- Public event records are separate from private society operational records.
- Private access is a domain/UI boundary in this MVP, not a server-side security guarantee; true multi-user isolation requires authentication/authorization and server-side persistence.


### 2026-10-03 — CP12A Events database
Status: COMPLETE
- Added first-class CampusEvent records with society, date, nature/highlight, special guests, progress, venue, deadline and eligibility.
- Added public Events workspace with a database/table presentation.
- Added local create/edit/delete operations through the domain store boundary.
- Added event status and progress visibility.
- Added persistence migration defaults so older localStorage state remains loadable.
- Added navigation and page metadata for the Events workspace.
- Next checkpoint: CP12B private Society Operations workspace.

### 2026-10-03 — CP12B Private Society Operations
Status: COMPLETE
- Added society records, memberships and private workspace metadata.
- Added local access-control checks that separate public event data from society-private operational data.
- Added event task tracker with member/lead assignment and pending/done state.
- Added contribution chart derived from task completion by member.
- Added estimated budget, actual expenditure and sponsorship tracking.
- Added promotion tracker and resource/requirement tracker.
- Added mobile layouts for the private workspace.
- Explicitly documented that this is an application boundary only; production isolation requires server-side auth/authz.

### 2026-10-03 — CP12C Post-event analysis
Status: COMPLETE
- Added structured analysis linked to an event.
- Captures registrations, attendees, winners, participant feedback, guest feedback, successes, problems, suggestions, final expenditure, photos/links, sponsors and event report.
- Added editable analysis flow inside the private society workspace.

### 2026-10-03 — CP12D Categorical feedback
Status: COMPLETE
- Added public Feedback workspace with event context, category, priority and sentiment.
- Added feedback persistence and organizer-facing category aggregation.
- Categories cover event, venue, organization, promotion, content, volunteers, technical, budget and other.
- Feedback remains local-first and is not represented as anonymous/server-secured until a backend is added.

### 2026-10-03 — CP12E Verification / hardening
Status: COMPLETE
- Added regression tests for private access, society CRUD, budgets, requirements, analysis, contribution and categorical feedback.
- Added mobile CSS for event database, private workspace and feedback.
- Fixed the repository CI workflow: npm caching was requested without a lockfile, causing setup-node to fail before tests. The cache option was removed.
- GitHub Actions run 157 passed all checks: npm install, 15 Vitest tests, and npm run build.
- Latest Vercel production deployment is READY on commit f5b302806b1a95d990c40d313f38d29c47e56585.
- Live deployment returned HTTP 200 and the bundled production JavaScript contains the Events, private Society Ops and Feedback surfaces.
- README documents the complete workflow and the limitation that browser-local private access is not a server-side security boundary.


## CP12 completion
Status: COMPLETE
All requested Notion-style workflows are implemented, persisted through the existing local-first repository boundary, mobile-hardened, regression-tested and production-built:
- Public Events database
- Private Society Operations workspace
- Event task/member/lead tracking
- Contribution chart
- Budget and sponsorship tracker
- Promotion tracker
- Resource/requirement tracker
- Post-event analysis
- Categorical feedback/suggestions
- README and progress documentation
- CI and Vercel verification


### 2026-10-03 — Feedback form layout bug
Status: FIXED
- Reproduced from the supplied screenshot: the feedback labels were relying on browser-inline label behavior, causing the textarea and field captions to collapse into the same horizontal line.
- Added scoped Feedback form CSS: block labels, full-width controls, box sizing, explicit textarea sizing, desktop two-column fields and mobile single-column fields.
- Awaiting/using repository CI and Vercel production rebuild for final deployment verification.


### 2026-10-03 — Settings Personal Context layout bug
Status: FIXED
- Reproduced from the supplied screenshot: the Personal Context header was allowing the EDIT CONTEXT control to consume the header width, leaving the profile heading in an unnaturally narrow column.
- Scoped the fix to the Personal Context card: the copy column now flexes, while EDIT CONTEXT keeps intrinsic button width on desktop.
- Preserved the full-width edit control behavior for mobile layouts.
- Production verification will follow the normal CI/Vercel rebuild.


## CP13 — Society public pages + society event posts
Status: IN PROGRESS

Requested product changes from the supplied specification:
1. Build a public Society page following the existing Campus OS visual/system language.
2. Society hero/main page must expose: society name, FIC, genre, an approximately 50-word X-Factor, and a timeline of significant changes/contributions.
3. Add a members section showing all members and their positions.
4. Add an Upcoming Events section with event post information, prizes, special guests, and a clear reason/value proposition for joining.
5. Add a Past Events section with photographs/media and winners.
6. Define Society Event Posts as authored by a society, including collaborating societies where applicable.
7. Support an optional event description, registration link, X-Factor, and poster/image/video media.
8. Connect society public pages to the existing event/society domain model without exposing private Society Ops data.
9. Add responsive styling and regression coverage.
10. Update documentation/progress checkpoints after each implementation stage.
11. Run CI/build verification and finish only when the complete feature set is implemented.

Execution order:
- CP13A: public society domain schema + seeded content
- CP13B: public society page and navigation
- CP13C: society event post model/UI and upcoming/past event presentation
- CP13D: responsive styling + tests
- CP13E: CI/build/deployment verification and final documentation


### CP13A — Public society domain schema
Status: COMPLETE
- Added public society metadata: FIC, genre, X-Factor, timeline and public member positions.
- Added separate Society Event Post records so public society content is distinct from private Society Ops.
- Event posts support authoring society, collaborating societies, optional description, registration link, prizes, special guests, join reason, X-Factor, media, upcoming/past status and winners.
- Added seeded public examples and local persistence migration support.
