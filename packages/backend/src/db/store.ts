import { Task, Agent, Workflow, CostBreakdown, SDLCPhase } from '@agentic-taskboard/shared'
import { nanoid } from 'nanoid'

class DataStore {
  private tasks: Map<string, Task> = new Map()
  private agents: Map<string, Agent> = new Map()
  private workflows: Map<string, Workflow> = new Map()

  // Task operations
  createTask(title: string, description: string, model?: string, codebasePath?: string): Task {
    const task: Task = {
      id: nanoid(),
      title,
      description,
      status: 'todo',
      model,
      codebasePath,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      totalCost: 0,
      sessionCost: 0,
      logs: [],
    }
    this.tasks.set(task.id, task)
    return task
  }

  getTask(id: string): Task | undefined {
    return this.tasks.get(id)
  }

  getAllTasks(): Task[] {
    return Array.from(this.tasks.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }

  updateTask(id: string, updates: Partial<Task>): Task | undefined {
    const task = this.tasks.get(id)
    if (!task) return undefined

    const updatedTask = {
      ...task,
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    this.tasks.set(id, updatedTask)
    return updatedTask
  }

  deleteTask(id: string): boolean {
    return this.tasks.delete(id)
  }

  // Agent operations
  createAgent(name: string, type: Agent['type']): Agent {
    const agent: Agent = {
      id: nanoid(),
      name,
      type,
      status: 'idle',
      createdAt: new Date().toISOString(),
    }
    this.agents.set(agent.id, agent)
    return agent
  }

  getAgent(id: string): Agent | undefined {
    return this.agents.get(id)
  }

  getAllAgents(): Agent[] {
    return Array.from(this.agents.values())
  }

  updateAgent(id: string, updates: Partial<Agent>): Agent | undefined {
    const agent = this.agents.get(id)
    if (!agent) return undefined

    const updatedAgent = { ...agent, ...updates }
    this.agents.set(id, updatedAgent)
    return updatedAgent
  }

  // Workflow operations
  createWorkflow(workflow: Workflow): Workflow {
    this.workflows.set(workflow.id, workflow)
    return workflow
  }

  getWorkflow(id: string): Workflow | undefined {
    return this.workflows.get(id)
  }

  getWorkflowsByTaskId(taskId: string): Workflow[] {
    return Array.from(this.workflows.values()).filter(w => w.taskId === taskId)
  }

  updateWorkflow(id: string, updates: Partial<Workflow>): Workflow | undefined {
    const workflow = this.workflows.get(id)
    if (!workflow) return undefined

    const updatedWorkflow = { ...workflow, ...updates }
    this.workflows.set(id, updatedWorkflow)
    return updatedWorkflow
  }

  // Cost operations
  getCostBreakdown(): CostBreakdown {
    const tasks = this.getAllTasks()
    const total = tasks.reduce((sum, task) => sum + task.totalCost, 0)

    const byPhase: Record<SDLCPhase, number> = {
      todo: 0,
      plan: 0,
      build: 0,
      review: 0,
      test: 0,
      done: 0,
    }

    const byAgent: Record<string, number> = {}
    const byTask: Record<string, number> = {}

    const workflows = Array.from(this.workflows.values())
    workflows.forEach(workflow => {
      byPhase[workflow.phase] += workflow.cost

      if (!byAgent[workflow.agentId]) {
        byAgent[workflow.agentId] = 0
      }
      byAgent[workflow.agentId] += workflow.cost

      if (!byTask[workflow.taskId]) {
        byTask[workflow.taskId] = 0
      }
      byTask[workflow.taskId] += workflow.cost
    })

    return { total, byPhase, byAgent, byTask }
  }

  // Reset session costs
  resetSessionCosts(): void {
    this.tasks.forEach(task => {
      task.sessionCost = 0
      this.tasks.set(task.id, task)
    })
  }
}

export const store = new DataStore()
