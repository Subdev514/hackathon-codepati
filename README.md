# Campus OS

Hackathon MVP for a Campus Operating System. The first slice intentionally looks like a campus social feed, but the data model connects posts to events, clubs, deadlines, tasks and opportunities.

## MVP flow

1. Campus information enters as a feed post.
2. Posts carry structured context such as type, tags, deadline and linked entity.
3. The workflow panel turns relevant information into personalized next actions.
4. The graph view demonstrates relationships between an event, club, deadline, team and tasks.

## Run

npm install
npm run dev

## Next build steps

- Persist entities and relationships in a database.
- Add authentication and campus/college scoping.
- Add AI extraction from unstructured notices/posts.
- Generate workflows from extracted relationships.
- Add real notifications and calendar integration.
