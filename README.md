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
- Task completion and workflow progress
- LocalStorage persistence across reloads
- Explainable “For You” relevance based on student profile
- Responsive UI
- Vitest extraction/commit tests
- GitHub Actions verification workflow for test + production build

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
7. For You relevance reasons

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
