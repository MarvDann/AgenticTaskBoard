import { FastifyInstance } from 'fastify'
import {
  CreateTaskRequest,
  UpdateTaskRequest,
  CreateTaskResponse,
  GetTasksResponse,
} from '@agentic-taskboard/shared'
import { store } from '../db/store'
import { wsServer } from '../websocket/server'
import { orchestrator } from '../agents/orchestrator'

export async function taskRoutes(fastify: FastifyInstance) {
  // Get all tasks
  fastify.get<{ Reply: GetTasksResponse }>('/tasks', async () => {
    const tasks = store.getAllTasks()
    return { tasks }
  })

  // Get task by ID
  fastify.get<{ Params: { id: string } }>('/tasks/:id', async (request, reply) => {
    const task = store.getTask(request.params.id)
    if (!task) {
      reply.code(404).send({ error: 'Task not found' })
      return
    }
    return task
  })

  // Create task
  fastify.post<{ Body: CreateTaskRequest; Reply: CreateTaskResponse }>(
    '/tasks',
    async request => {
      const { title, description, model, codebasePath } = request.body
      const task = store.createTask(title, description, model, codebasePath)

      // Broadcast task creation
      wsServer.broadcast({
        type: 'task:created',
        payload: task,
        timestamp: new Date().toISOString(),
      })

      return { task }
    }
  )

  // Update task
  fastify.patch<{ Params: { id: string }; Body: UpdateTaskRequest }>(
    '/tasks/:id',
    async (request, reply) => {
      const task = store.updateTask(request.params.id, request.body)
      if (!task) {
        reply.code(404).send({ error: 'Task not found' })
        return
      }

      // Broadcast task update
      wsServer.broadcast({
        type: 'task:updated',
        payload: task,
        timestamp: new Date().toISOString(),
      })

      return task
    }
  )

  // Delete task
  fastify.delete<{ Params: { id: string } }>('/tasks/:id', async (request, reply) => {
    const deleted = store.deleteTask(request.params.id)
    if (!deleted) {
      reply.code(404).send({ error: 'Task not found' })
      return
    }

    // Broadcast task deletion
    wsServer.broadcast({
      type: 'task:deleted',
      payload: { id: request.params.id },
      timestamp: new Date().toISOString(),
    })

    return { success: true }
  })

  // Assign agent to task
  fastify.post<{ Params: { id: string }; Body: { agentId?: string } }>(
    '/tasks/:id/assign',
    async (request, reply) => {
      const task = store.getTask(request.params.id)
      if (!task) {
        reply.code(404).send({ error: 'Task not found' })
        return
      }

      const agentId = request.body.agentId || 'auto'
      const updatedTask = store.updateTask(task.id, { assignedAgent: agentId })

      if (!updatedTask) {
        reply.code(500).send({ error: 'Failed to assign agent' })
        return
      }

      // Broadcast task update
      wsServer.broadcast({
        type: 'task:updated',
        payload: updatedTask,
        timestamp: new Date().toISOString(),
      })

      // Trigger orchestrator workflow
      orchestrator.startOrchestration(task.id)

      return updatedTask
    }
  )
}
