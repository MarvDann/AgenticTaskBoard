import { createSignal } from 'solid-js'
import { Task, Agent, CostBreakdown, CreateTaskRequest } from '@agentic-taskboard/shared'
import { wsClient } from './websocket'

const API_URL = import.meta.env.DEV ? 'http://localhost:3001/api' : '/api'

// State
const [tasks, setTasks] = createSignal<Task[]>([])
const [agents, setAgents] = createSignal<Agent[]>([])
const [costs, setCosts] = createSignal<CostBreakdown>({
  total: 0,
  byPhase: { todo: 0, plan: 0, build: 0, review: 0, test: 0, done: 0 },
  byAgent: {},
  byTask: {},
})
const [loading, setLoading] = createSignal(false)

// API functions
export async function fetchTasks() {
  setLoading(true)
  try {
    const response = await fetch(`${API_URL}/tasks`)
    const data = await response.json()
    setTasks(data.tasks)
  } catch (error) {
    console.error('Error fetching tasks:', error)
  } finally {
    setLoading(false)
  }
}

export async function createTask(request: CreateTaskRequest): Promise<Task | null> {
  try {
    const response = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    })
    const data = await response.json()
    // Don't update local state - let WebSocket handle it to prevent duplicates
    return data.task
  } catch (error) {
    console.error('Error creating task:', error)
    return null
  }
}

export async function updateTask(id: string, updates: Partial<Task>): Promise<Task | null> {
  try {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    })
    return await response.json()
  } catch (error) {
    console.error('Error updating task:', error)
    return null
  }
}

export async function assignAgent(taskId: string): Promise<Task | null> {
  try {
    const response = await fetch(`${API_URL}/tasks/${taskId}/assign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })
    return await response.json()
  } catch (error) {
    console.error('Error assigning agent:', error)
    return null
  }
}

export async function deleteTask(id: string): Promise<boolean> {
  try {
    await fetch(`${API_URL}/tasks/${id}`, { method: 'DELETE' })
    return true
  } catch (error) {
    console.error('Error deleting task:', error)
    return false
  }
}

export async function fetchAgents() {
  try {
    const response = await fetch(`${API_URL}/agents`)
    const data = await response.json()
    setAgents(data.agents)
  } catch (error) {
    console.error('Error fetching agents:', error)
  }
}

export async function fetchCosts() {
  try {
    const response = await fetch(`${API_URL}/costs`)
    const data = await response.json()
    setCosts(data.costs)
  } catch (error) {
    console.error('Error fetching costs:', error)
  }
}

// WebSocket handlers
wsClient.subscribe(message => {
  switch (message.type) {
  case 'task:created':
    setTasks(prev => {
      const newTask = message.payload as Task
      // Check if task already exists to prevent duplicates
      if (prev.some(t => t.id === newTask.id)) {
        return prev
      }
      return [newTask, ...prev]
    })
    break

  case 'task:updated':
    setTasks(prev =>
      prev.map(t => (t.id === (message.payload as Task).id ? (message.payload as Task) : t))
    )
    break

  case 'task:deleted':
    setTasks(prev => prev.filter(t => t.id !== (message.payload as { id: string }).id))
    break

  case 'agent:created':
    setAgents(prev => [...prev, message.payload as Agent])
    break

  case 'agent:updated':
  case 'agent:status-changed':
    setAgents(prev =>
      prev.map(a => (a.id === (message.payload as Agent).id ? (message.payload as Agent) : a))
    )
    break

  case 'cost:updated':
    fetchCosts()
    break
  }
})

// Export state
export { tasks, agents, costs, loading }
