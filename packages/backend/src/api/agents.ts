import { FastifyInstance } from 'fastify'
import { GetAgentsResponse, AgentType, AgentStatus } from '@agentic-taskboard/shared'
import { store } from '../db/store'
import { wsServer } from '../websocket/server'

export async function agentRoutes(fastify: FastifyInstance) {
  // Get all agents
  fastify.get<{ Reply: GetAgentsResponse }>('/agents', async () => {
    const agents = store.getAllAgents()
    return { agents }
  })

  // Get agent by ID
  fastify.get<{ Params: { id: string } }>('/agents/:id', async (request, reply) => {
    const agent = store.getAgent(request.params.id)
    if (!agent) {
      reply.code(404).send({ error: 'Agent not found' })
      return
    }
    return agent
  })

  // Create agent
  fastify.post<{ Body: { name: string; type: string } }>(
    '/agents',
    async (request, reply) => {
      const { name, type } = request.body

      if (!['orchestrator', 'planner', 'builder', 'reviewer', 'tester'].includes(type)) {
        reply.code(400).send({ error: 'Invalid agent type' })
        return
      }

      const agent = store.createAgent(name, type as AgentType)

      // Broadcast agent creation
      wsServer.broadcast({
        type: 'agent:created',
        payload: agent,
        timestamp: new Date().toISOString(),
      })

      return agent
    }
  )

  // Update agent status
  fastify.patch<{ Params: { id: string }; Body: { status: string } }>(
    '/agents/:id/status',
    async (request, reply) => {
      const agent = store.updateAgent(request.params.id, { status: request.body.status as AgentStatus })
      if (!agent) {
        reply.code(404).send({ error: 'Agent not found' })
        return
      }

      // Broadcast agent status change
      wsServer.broadcast({
        type: 'agent:status-changed',
        payload: agent,
        timestamp: new Date().toISOString(),
      })

      return agent
    }
  )
}
