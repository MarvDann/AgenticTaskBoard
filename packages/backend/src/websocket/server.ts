import { FastifyInstance } from 'fastify'
import { WSMessage } from '@agentic-taskboard/shared'
import { WebSocket } from 'ws'

export class WebSocketServer {
  private clients: Set<WebSocket> = new Set()

  async register(fastify: FastifyInstance) {
    await fastify.register(import('@fastify/websocket'))

    fastify.get('/ws', { websocket: true }, (socket) => {
      this.clients.add(socket)

      socket.on('close', () => {
        this.clients.delete(socket)
      })

      socket.on('error', (error: Error) => {
        console.error('WebSocket error:', error)
        this.clients.delete(socket)
      })

      // Send initial connection success message
      this.sendToClient(socket, {
        type: 'task:updated',
        payload: { message: 'Connected to Agentic TaskBoard' },
        timestamp: new Date().toISOString(),
      })
    })
  }

  broadcast<T>(message: WSMessage<T>) {
    const data = JSON.stringify(message)
    this.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data)
      }
    })
  }

  sendToClient<T>(client: WebSocket, message: WSMessage<T>) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message))
    }
  }

  getClientCount(): number {
    return this.clients.size
  }
}

export const wsServer = new WebSocketServer()
