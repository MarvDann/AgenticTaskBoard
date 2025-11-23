Assign an AI agent to work on a task autonomously.

To assign an agent to a task:

1. **Get the task ID** from the task you want to assign
2. **Call the assignment API** endpoint: POST /api/tasks/:id/assign
3. **The orchestrator will automatically**:
   - Move the task through each SDLC phase
   - Spawn specialized agents for Plan, Build, Review, and Test
   - Track all costs and log all activities
   - Update the task status in real-time
   - Move to "Done" when all phases complete successfully

**Agent Workflow**:
- **Plan Phase**: Planner agent analyzes requirements and creates implementation plan
- **Build Phase**: Builder agent implements the solution based on the plan
- **Review Phase**: Reviewer agent reviews code quality and best practices
- **Test Phase**: Tester agent writes and runs comprehensive tests

**Full Context Handoff**: Each agent receives complete context from the previous phase

**Real-time Updates**: Watch the task move through the board automatically

**Cost Tracking**: See exactly how much each phase costs
