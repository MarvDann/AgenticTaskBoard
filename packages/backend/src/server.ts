import Fastify from 'fastify'
import cors from '@fastify/cors'
import { taskRoutes } from './api/tasks.js'
import { agentRoutes } from './api/agents.js'
import { costRoutes } from './api/costs.js'
import { wsServer } from './websocket/server.js'

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001
const HOST = process.env.HOST || '0.0.0.0'

async function buildServer() {
  const fastify = Fastify({
    logger: {
      level: 'info',
      transport: {
        target: 'pino-pretty',
        options: {
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
        },
      },
    },
  })

  // Register CORS
  await fastify.register(cors, {
    origin: true,
    credentials: true,
  })

  // Register WebSocket
  await wsServer.register(fastify)

  // Register API routes
  await fastify.register(taskRoutes, { prefix: '/api' })
  await fastify.register(agentRoutes, { prefix: '/api' })
  await fastify.register(costRoutes, { prefix: '/api' })

  // Health check
  fastify.get('/health', async () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
    clients: wsServer.getClientCount(),
  }))

  return fastify
}

async function start() {
  try {
    const fastify = await buildServer()
    await fastify.listen({ port: PORT, host: HOST })

    console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║         🤖 Agentic TaskBoard Backend Server 🤖           ║
║                                                           ║
║  Server running at: http://${HOST}:${PORT}              ║
║  WebSocket available at: ws://${HOST}:${PORT}/ws         ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
    `)
  } catch (err) {
    console.error('Error starting server:', err)
    process.exit(1)
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...')
  process.exit(0)
})

start()

export { buildServer }
