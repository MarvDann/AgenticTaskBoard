import { describe, it, expect } from 'vitest'
import { PlannerAgent } from '../src/agents/planner'
import { BuilderAgent } from '../src/agents/builder'
import { ReviewerAgent } from '../src/agents/reviewer'
import { TesterAgent } from '../src/agents/tester'
import { AgentContext } from '@agentic-taskboard/shared'

describe('Agents', () => {
  const mockContext: AgentContext = {
    taskId: 'test-task-123',
    phase: 'plan',
    files: [],
    requirements: ['Feature 1', 'Feature 2'],
  }

  describe('PlannerAgent', () => {
    it('should execute planning phase', async () => {
      const agent = new PlannerAgent()
      const result = await agent.execute(mockContext)

      expect(result.success).toBe(true)
      expect(result.phase).toBe('plan')
      expect(result.context.plan).toBeDefined()
      expect(result.cost).toBeGreaterThan(0)
    })
  })

  describe('BuilderAgent', () => {
    it('should execute build phase with plan context', async () => {
      const agent = new BuilderAgent()
      const contextWithPlan: AgentContext = {
        ...mockContext,
        phase: 'build',
        previousPhaseContext: {
          plan: {
            steps: [{ id: 1, description: 'Step 1' }],
          },
        },
      }

      const result = await agent.execute(contextWithPlan)

      expect(result.success).toBe(true)
      expect(result.phase).toBe('build')
      expect(result.context.implementation).toBeDefined()
    })
  })

  describe('ReviewerAgent', () => {
    it('should execute review phase with implementation context', async () => {
      const agent = new ReviewerAgent()
      const contextWithImpl: AgentContext = {
        ...mockContext,
        phase: 'review',
        previousPhaseContext: {
          implementation: {
            filesCreated: 5,
          },
        },
      }

      const result = await agent.execute(contextWithImpl)

      expect(result.success).toBe(true)
      expect(result.phase).toBe('review')
      expect(result.context.review).toBeDefined()
    })
  })

  describe('TesterAgent', () => {
    it('should execute test phase with review context', async () => {
      const agent = new TesterAgent()
      const contextWithReview: AgentContext = {
        ...mockContext,
        phase: 'test',
        previousPhaseContext: {
          review: {
            approved: true,
          },
        },
      }

      const result = await agent.execute(contextWithReview)

      expect(result.success).toBe(true)
      expect(result.phase).toBe('test')
      expect(result.context.testResults).toBeDefined()
    })
  })
})
