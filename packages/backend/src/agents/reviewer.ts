import { AgentContext, AgentResult } from '@agentic-taskboard/shared'
import { BaseAgent } from './base-agent'

export class ReviewerAgent extends BaseAgent {
  constructor() {
    super('Reviewer Agent', 'reviewer')
  }

  async execute(context: AgentContext): Promise<AgentResult> {
    this.log('info', 'Starting review phase', { taskId: context.taskId })

    try {
      const implementation = context.previousPhaseContext?.implementation

      if (!implementation) {
        throw new Error('No implementation found from previous phase')
      }

      this.log('info', 'Reviewing code quality and correctness', {
        fileCount: context.files.length,
      })

      // In a real implementation, this would spawn a Claude agent
      // The agent would review code quality, security, best practices
      // For now, we'll simulate the review process

      const review = {
        codeQuality: 'good',
        securityIssues: 0,
        bestPracticesFollowed: true,
        suggestions: [
          'Consider adding more error handling',
          'Add JSDoc comments for public APIs',
        ],
        approved: true,
      }

      this.log('success', 'Review phase completed successfully', {
        approved: review.approved,
        suggestions: review.suggestions.length,
      })

      // Simulate cost
      this.addCost(0.10)

      return this.createResult(
        true,
        'review',
        {
          review,
          implementation: context.previousPhaseContext?.implementation,
          readyForTest: true,
        },
        ['review-report.md']
      )
    } catch (error) {
      this.log('error', 'Review phase failed', { error: String(error) })
      return this.createResult(false, 'review', {}, [], String(error))
    }
  }
}
