import { createSignal, onCleanup } from 'solid-js'
import { WSMessage } from '@agentic-taskboard/shared'

const WS_URL = import.meta.env.DEV ? 'ws://localhost:3001/ws' : `ws://${window.location.host}/ws`

type MessageHandler = (message: WSMessage) => void

class WebSocketClient {
  private ws: WebSocket | null = null
  private reconnectTimeout: number | null = null
  private handlers: Set<MessageHandler> = new Set()
  private reconnectDelay = 1000

  connect() {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return
    }

    try {
      this.ws = new WebSocket(WS_URL)

      this.ws.onopen = () => {
        console.log('✅ WebSocket connected')
        this.reconnectDelay = 1000
      }

      this.ws.onmessage = event => {
        try {
          const message: WSMessage = JSON.parse(event.data)
          this.handlers.forEach(handler => handler(message))
        } catch (error) {
          console.error('Error parsing WebSocket message:', error)
        }
      }

      this.ws.onerror = error => {
        console.error('WebSocket error:', error)
      }

      this.ws.onclose = () => {
        console.log('WebSocket disconnected, reconnecting...')
        this.scheduleReconnect()
      }
    } catch (error) {
      console.error('Error connecting to WebSocket:', error)
      this.scheduleReconnect()
    }
  }

  private scheduleReconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout)
    }

    this.reconnectTimeout = window.setTimeout(() => {
      console.log('Attempting to reconnect...')
      this.reconnectDelay = Math.min(this.reconnectDelay * 2, 30000)
      this.connect()
    }, this.reconnectDelay)
  }

  subscribe(handler: MessageHandler) {
    this.handlers.add(handler)
    return () => this.handlers.delete(handler)
  }

  disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout)
    }
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }
}

export const wsClient = new WebSocketClient()

export function useWebSocket() {
  const [connected, setConnected] = createSignal(false)

  // Auto-connect on mount
  wsClient.connect()

  // Track connection status
  const checkConnection = setInterval(() => {
    setConnected(wsClient['ws']?.readyState === WebSocket.OPEN)
  }, 1000)

  onCleanup(() => {
    clearInterval(checkConnection)
  })

  return { connected, client: wsClient }
}
