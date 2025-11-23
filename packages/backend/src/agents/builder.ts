import { AgentContext, AgentResult } from '@agentic-taskboard/shared'
import { BaseAgent } from './base-agent'

export class BuilderAgent extends BaseAgent {
  constructor() {
    super('Builder Agent', 'builder')
  }

  async execute(context: AgentContext): Promise<AgentResult> {
    this.log('info', 'Starting build phase', { taskId: context.taskId })

    try {
      const plan = context.previousPhaseContext?.plan as { steps?: unknown[] } | undefined

      if (!plan) {
        throw new Error('No plan found from previous phase')
      }

      this.log('info', 'Implementing solution based on plan', {
        stepCount: plan.steps?.length || 0,
      })

      // In a real implementation, this would spawn a Claude agent
      // The agent would write code based on the plan
      // For now, we'll simulate the build process

      const implementation = {
        filesCreated: context.files.length,
        linesOfCode: context.files.length * 50, // Simulated
        testsIncluded: true,
        documentationIncluded: true,
      }

      this.log('success', 'Build phase completed successfully', {
        filesCreated: implementation.filesCreated,
      })

      // Simulate cost
      this.addCost(0.15)

      return this.createResult(
        true,
        'build',
        {
          implementation,
          plan: context.previousPhaseContext?.plan,
          readyForReview: true,
        },
        context.files
      )
    } catch (error) {
      this.log('error', 'Build phase failed', { error: String(error) })
      return this.createResult(false, 'build', {}, [], String(error))
    }
  }
}
