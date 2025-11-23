import { FastifyInstance } from 'fastify'
import { GetCostBreakdownResponse } from '@agentic-taskboard/shared'
import { store } from '../db/store'

export async function costRoutes(fastify: FastifyInstance) {
  // Get cost breakdown
  fastify.get<{ Reply: GetCostBreakdownResponse }>('/costs', async () => {
    const costs = store.getCostBreakdown()
    return { costs }
  })

  // Reset session costs
  fastify.post('/costs/reset-session', async () => {
    store.resetSessionCosts()
    return { success: true }
  })
}
