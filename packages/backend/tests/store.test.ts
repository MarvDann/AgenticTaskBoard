import { describe, it, expect, beforeEach } from 'vitest'
import { store } from '../src/db/store'

describe('DataStore', () => {
  beforeEach(() => {
    // Reset store by creating fresh tasks
  })

  describe('Task Operations', () => {
    it('should create a task', () => {
      const task = store.createTask('Test Task', 'Test Description')

      expect(task.id).toBeDefined()
      expect(task.title).toBe('Test Task')
      expect(task.description).toBe('Test Description')
      expect(task.status).toBe('todo')
      expect(task.totalCost).toBe(0)
    })

    it('should get a task by ID', () => {
      const task = store.createTask('Test Task', 'Test Description')
      const retrieved = store.getTask(task.id)

      expect(retrieved).toBeDefined()
      expect(retrieved?.id).toBe(task.id)
    })

    it('should update a task', () => {
      const task = store.createTask('Test Task', 'Test Description')
      const updated = store.updateTask(task.id, { status: 'plan' })

      expect(updated?.status).toBe('plan')
    })

    it('should delete a task', () => {
      const task = store.createTask('Test Task', 'Test Description')
      const deleted = store.deleteTask(task.id)

      expect(deleted).toBe(true)
      expect(store.getTask(task.id)).toBeUndefined()
    })

    it('should get all tasks', () => {
      store.createTask('Task 1', 'Description 1')
      store.createTask('Task 2', 'Description 2')

      const tasks = store.getAllTasks()
      expect(tasks.length).toBeGreaterThanOrEqual(2)
    })
  })

  describe('Agent Operations', () => {
    it('should create an agent', () => {
      const agent = store.createAgent('Test Agent', 'planner')

      expect(agent.id).toBeDefined()
      expect(agent.name).toBe('Test Agent')
      expect(agent.type).toBe('planner')
      expect(agent.status).toBe('idle')
    })

    it('should update agent status', () => {
      const agent = store.createAgent('Test Agent', 'planner')
      const updated = store.updateAgent(agent.id, { status: 'working' })

      expect(updated?.status).toBe('working')
    })
  })

  describe('Cost Tracking', () => {
    it('should calculate cost breakdown', () => {
      const costs = store.getCostBreakdown()

      expect(costs.total).toBeDefined()
      expect(costs.byPhase).toBeDefined()
      expect(costs.byAgent).toBeDefined()
      expect(costs.byTask).toBeDefined()
    })
  })
})
