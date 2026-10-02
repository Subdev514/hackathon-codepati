# Campus OS — Project Brain

Last updated: 2026-10-02
Repository: sarkarshivaditya-lab/for-friends
Status: Active hackathon build

## 1. Product definition

Campus OS is a Campus Operating System, not a Reddit clone.

Core problem:
Campus information is fragmented across announcements, events, clubs, opportunities, resources, people, deadlines and projects. The system must preserve relationships between these objects and turn relevant information into personalized workflows.

Core product loop:

Campus information
→ structured entities
→ relationships/context
→ personalization
→ tasks/workflows
→ reminders/actions

The Reddit-style feed is only the input/discovery surface.

## 2. Hackathon strategy

Time is limited. Prioritize the smallest vertical slice that clearly demonstrates the problem statement.

The judge should be able to see:
1. A messy campus information item enters the system.
2. The system understands what it represents.
3. Relationships are preserved.
4. The user's context changes what is relevant.
5. The system produces concrete next actions.

Do NOT spend hackathon time on:
- elaborate Reddit karma systems
- complex moderation
- unnecessary social features
- premature microservices
- overbuilt authentication
- production-scale infrastructure

## 3. Current implementation

The repository started empty. Initial MVP has been created.

Current files:
- package.json — Vite/React/TypeScript setup
- index.html — application entry
- vite.config.ts — Vite React config
- tsconfig.json — TypeScript config
- .gitignore
- src/main.tsx — complete MVP UI and local demo data
- src/styles.css — responsive visual system
- README.md — project overview
- progress.md — this project brain

Current UI:
- Home
- For You
- Explore
- My Tasks
- Network
- Campus search
- Reddit-style feed cards
- Personalized workflow panel
- Task completion/progress
- Campus relationship graph
- Responsive layout

Current demo entities include:
- AI Hackathon
- AI Club
- Microsoft Ambassador opportunity
- Figma Workshop
- CN Viva Notes

Current example relationship:
AI Club
→ organizes
AI Hackathon
→ has
Oct 10 deadline
→ creates
registration/team/idea tasks

## 4. Current data model concept

The system should eventually use first-class entities rather than treating every item as a post.

Primary entities:
- User
- Person
- Club
- Organization
- Event
- Opportunity
- Project
- Task
- Deadline
- Resource
- Post

Relationships include:
- User member_of Club
- Club organizes Event
- Organization publishes Opportunity
- Event has Deadline
- Event requires Team
- User interested_in Opportunity
- Project uses Resource
- User assigned Task
- Task derived_from Event
- Post references Entity
- Person participates_in Project/Event

The graph is a core product feature, not merely a visualization.

## 5. Immediate next priority

Build the first real structured data layer.

Recommended order:
1. Define TypeScript domain types for entities and relationships.
2. Move demo data out of the UI component.
3. Create a local repository/store abstraction.
4. Add event/opportunity/task relationship generation.
5. Add a Create Post / Create Announcement flow.
6. Add an AI extraction layer for unstructured campus text.
7. Convert extracted information into entities and relationships.
8. Generate personalized workflows from those relationships.
9. Add persistence.
10. Add authentication/campus scoping only after the core workflow is convincing.

## 6. AI extraction target

Example input:

"AI Club is conducting a 24-hour hackathon on October 15. Teams of 2–4 can participate. Registration closes October 10. Participants need to submit their idea before October 13."

Expected structured result:

Event:
- name: AI Hackathon
- organization: AI Club
- date: October 15

Constraint:
- team size: 2–4

Deadlines:
- registration: October 10
- idea submission: October 13

Generated workflow:
- Find teammates
- Register for hackathon
- Prepare idea
- Submit idea

The extraction result must retain source/context so generated tasks can explain why they exist.

## 7. Personalization target

User context should eventually contain things such as:
- year
- branch
- interests
- clubs
- followed topics
- active projects
- existing tasks
- availability/preferences

Example:
A hackathon announcement may be highly relevant to an AI-interested CSE student but less relevant to another student.

Personalization should affect:
- feed ordering
- recommended opportunities
- generated tasks
- deadlines surfaced
- related people/clubs/resources

Do not make opaque recommendations the core demo. Always show the reason/context behind important recommendations.

## 8. Demo storyline

Preferred hackathon demo:

1. Open Campus OS.
2. Show mixed campus feed.
3. Open a hackathon announcement.
4. Show that the announcement is understood as an Event with an Organization, Deadline and Team requirement.
5. Show relationship graph.
6. Show personalized workflow being generated.
7. Complete one task.
8. Show progress update.
9. Explain that the same architecture can ingest notices, club announcements, opportunities, academic resources and project information.

The strongest visual transition is:
POST → UNDERSTOOD → CONNECTED → ACTIONABLE.

## 9. Technical direction

Current:
- React
- TypeScript
- Vite
- Local in-memory demo data

Preferred near-term architecture:
UI
→ domain/service layer
→ local persistence
→ optional API/AI service

Keep domain logic separate from UI so the demo can later move from local state to a backend without rewriting the product.

Avoid coupling business logic directly to React components.

## 10. Visual direction

Current visual language:
- dark sidebar
- warm off-white main background
- muted green/lime accent
- compact information-dense cards
- premium productivity-tool aesthetic
- responsive desktop/mobile behavior

Maintain this visual identity unless there is a strong product reason to change it.

## 11. Development rules

IMPORTANT: This file is the project brain.

After EVERY meaningful code edit:
1. Read progress.md before making architectural changes.
2. Update progress.md after the edit.
3. Record what changed.
4. Record important decisions.
5. Record bugs/test status if relevant.
6. Update the immediate next priority.
7. Never treat the repository as a fresh project.

Before adding a feature, check whether it conflicts with the product definition or hackathon strategy.

Prefer working vertical slices over isolated infrastructure.

Do not delete working functionality unless there is a clear reason.

## 12. Current risks

- The current application is demo/local-state only.
- No backend persistence yet.
- No real AI extraction yet.
- No authentication/campus isolation.
- Relationship graph is currently visual/demo data rather than a true graph store.
- Build has not yet been executed in this environment after initial bootstrap.

These are known limitations, not reasons to expand scope prematurely.

## 13. Definition of success

For the hackathon MVP, success means a judge can understand in under two minutes that:

"This system does not merely display campus information. It understands how campus information is connected and turns it into personalized work."

Everything built next should strengthen that sentence.

## 14. Change log

### 2026-10-02 — Initial MVP
- Repository confirmed empty.
- Bootstrapped Vite + React + TypeScript.
- Created campus Reddit-style feed.
- Added structured post metadata.
- Added personalized workflow panel.
- Added task completion/progress.
- Added campus relationship graph.
- Added Home, For You, Explore, My Tasks and Network views.
- Added responsive styling.
- Added README.
- Added this project brain.
