Create a new task in the Agentic TaskBoard.

Please create a task with the following information:

**Title**: [Provide a clear, concise title]

**Description**: [Provide detailed requirements and context]

After creating the task, you should:
1. Use the backend API to create the task
2. Return the task ID and details
3. Ask if the user wants to assign an agent to start working on it

The task will start in the "ToDo" column and can be moved through the SDLC phases:
- ToDo → Plan → Build → Review → Test → Done

When an agent is assigned, the orchestrator will automatically:
1. Create a planner agent to design the solution
2. Create a builder agent to implement it
3. Create a reviewer agent to review the code
4. Create a tester agent to write and run tests
5. Move the task to "Done" when complete

All agent activity, tool calls, and costs will be tracked in real-time.
