# Campus OS — Project Brain

Last updated: 2026-10-02
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
Status: IN PROGRESS
Goal: make entities, posts, relationships and tasks mutable through a small application store rather than hard-coded UI data.
Acceptance:
- one store/service owns current campus state
- UI can add entities/posts/tasks/relationships through service functions
- initial demo data still renders

### CP2 — Announcement ingestion
Status: NOT STARTED
Goal: user can paste/write a campus announcement and submit it.
Acceptance:
- Create Announcement action visible from primary UI
- announcement form captures title/body/type/source
- submitted text reaches domain service

### CP3 — Deterministic extraction engine
Status: NOT STARTED
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
Status: NOT STARTED
Goal: show the user what Campus OS understood before committing.
Acceptance:
- extracted entities shown as cards/chips
- relationships shown explicitly
- deadlines and requirements visible
- generated tasks previewed
- user can confirm or edit basic extracted fields

### CP5 — Commit graph + workflow
Status: NOT STARTED
Goal: confirmed announcement becomes real campus state.
Acceptance:
- creates post/entity/relationships
- creates derived deadlines and tasks
- tasks retain source entity/reason
- graph and workflow views reflect newly ingested data

### CP6 — Persistence
Status: NOT STARTED
Goal: refresh-safe local MVP.
Acceptance:
- domain state survives reload using localStorage
- safe hydration/fallback to demo data
- no loss when schema evolves

### CP7 — Personalization
Status: NOT STARTED
Goal: demonstrate why the same campus graph becomes a personalized OS.
Acceptance:
- local demo user profile has branch/year/interests/clubs
- relevance score/reason is transparent
- feed/workflow can surface relevant items with reasons
- no opaque recommendation claims

### CP8 — Product loop polish
Status: NOT STARTED
Goal: make the full POST → UNDERSTOOD → CONNECTED → ACTIONABLE flow obvious.
Acceptance:
- clear transitions/status labels
- announcement detail opens its relationships
- task completion updates progress
- empty/error states are intentional
- mobile layout remains usable

### CP9 — Verification and demo hardening
Status: NOT STARTED
Goal: verify build and core user journey.
Acceptance:
- production build passes
- core parser cases pass
- no obvious TypeScript/runtime errors
- README and progress reflect actual architecture
- final demo path is documented

### CP10 — Optional deployment/integration
Status: NOT STARTED
Only after CP0–CP9 are complete. Deployment, backend/API or external AI can be added if time permits and does not destabilize the MVP.

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

Active checkpoint: CP8 — Product loop polish.

Next action: harden UX states, extraction edge cases and dynamic graph presentation. Then run verification/build and document final demo path.


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
