# SDLC Orchestrator Skill

This skill orchestrates the complete Software Development Lifecycle for a given task.

## Capability

Autonomously execute all SDLC phases for a software development task:
1. **Planning**: Analyze requirements and design solution
2. **Building**: Implement the solution with best practices
3. **Reviewing**: Review code quality and security
4. **Testing**: Write and execute comprehensive tests

## Usage

When invoked, this skill will:

1. Create specialized sub-agents for each SDLC phase
2. Execute phases sequentially with full context handoff
3. Track costs and log all activities
4. Update task status in real-time via WebSocket
5. Handle errors and provide detailed reporting

## Integration

This skill integrates with:
- **Backend API**: For task and agent management
- **WebSocket**: For real-time updates
- **Cost Tracking**: Via hooks
- **Agent Logging**: Via hooks

## Example

```bash
# Invoke the skill for a task
/sdlc-orchestrate task-id-123
```

The skill will then autonomously:
- Plan the implementation
- Build the solution
- Review the code
- Test thoroughly
- Move task to "Done"

All while providing full observability and cost tracking.
