import { Task, Workflow, SDLCPhase, AgentContext } from '@agentic-taskboard/shared'
import { nanoid } from 'nanoid'
import { store } from '../db/store'
import { wsServer } from '../websocket/server'
import { PlannerAgent } from './planner'
import { BuilderAgent } from './builder'
import { ReviewerAgent } from './reviewer'
import { TesterAgent } from './tester'
import { BaseAgent } from './base-agent'

export class Orchestrator {
  private phaseAgents: Record<SDLCPhase, () => BaseAgent> = {
    todo: () => {
      throw new Error('No agent for todo phase')
    },
    plan: () => new PlannerAgent(),
    build: () => new BuilderAgent(),
    review: () => new ReviewerAgent(),
    test: () => new TesterAgent(),
    done: () => {
      throw new Error('No agent for done phase')
    },
  }

  async orchestrateTask(taskId: string): Promise<void> {
    const task = store.getTask(taskId)
    if (!task) {
      throw new Error(`Task ${taskId} not found`)
    }

    console.log(`\n🤖 Starting orchestration for task: ${task.title}`)

    // Define SDLC workflow phases
    const phases: SDLCPhase[] = ['plan', 'build', 'review', 'test']
    let previousContext: Record<string, unknown> = {}
    let accumulatedFiles: string[] = []

    for (const phase of phases) {
      try {
        // Update task status
        const updatedTask = store.updateTask(taskId, { status: phase })
        if (updatedTask) {
          wsServer.broadcast({
            type: 'task:updated',
            payload: updatedTask,
            timestamp: new Date().toISOString(),
          })
        }

        console.log(`▶️  Starting phase: ${phase.toUpperCase()} (30 second simulation)`)

        // Simulate phase execution with 30 second delay
        await this.simulatePhase(task, phase, previousContext, accumulatedFiles)

        console.log(`✅ Phase ${phase} completed successfully`)
      } catch (error) {
        console.error(`❌ Error in phase ${phase}:`, error)
        return
      }
    }

    // All phases completed successfully
    const finalTask = store.updateTask(taskId, { status: 'done' })
    if (finalTask) {
      wsServer.broadcast({
        type: 'task:updated',
        payload: finalTask,
        timestamp: new Date().toISOString(),
      })
    }

    console.log(`\n🎉 Task completed successfully: ${task.title}\n`)
  }

  private async simulatePhase(
    task: Task,
    phase: SDLCPhase,
    previousContext: Record<string, unknown>,
    files: string[]
  ): Promise<void> {
    // Create simulated workflow record
    const workflow: Workflow = {
      id: nanoid(),
      taskId: task.id,
      phase,
      agentId: nanoid(),
      agentType: phase === 'plan' ? 'planner' : phase === 'build' ? 'builder' : phase === 'review' ? 'reviewer' : 'tester',
      status: 'running',
      startTime: new Date().toISOString(),
      cost: 0.12, // Simulated cost
      logs: [],
      context: previousContext,
      outputFiles: [],
    }

    store.createWorkflow(workflow)

    wsServer.broadcast({
      type: 'workflow:started',
      payload: workflow,
      timestamp: new Date().toISOString(),
    })

    // Simulate 30 seconds of work
    await new Promise(resolve => setTimeout(resolve, 30000))

    // Update workflow as completed
    const updatedWorkflow = store.updateWorkflow(workflow.id, {
      status: 'completed',
      endTime: new Date().toISOString(),
      cost: 0.12,
      logs: [{
        id: nanoid(),
        timestamp: new Date().toISOString(),
        level: 'success' as const,
        message: `Completed ${phase} phase simulation`,
      }],
      outputFiles: [],
      context: { ...previousContext, [phase]: 'completed' },
    })

    if (updatedWorkflow) {
      wsServer.broadcast({
        type: 'workflow:completed',
        payload: updatedWorkflow,
        timestamp: new Date().toISOString(),
      })
    }

    // Update task cost
    const costUpdatedTask = store.updateTask(task.id, {
      totalCost: task.totalCost + 0.12,
      sessionCost: task.sessionCost + 0.12,
    })

    if (costUpdatedTask) {
      wsServer.broadcast({
        type: 'cost:updated',
        payload: { taskId: task.id, cost: 0.12, phase },
        timestamp: new Date().toISOString(),
      })
    }
  }

  private async executePhase(
    task: Task,
    phase: SDLCPhase,
    previousContext: Record<string, unknown>,
    files: string[]
  ) {
    console.log(`\n▶️  Executing phase: ${phase.toUpperCase()}`)

    const agent = this.phaseAgents[phase]()
    const agentData = store.createAgent(agent.getAgent().name, agent.getAgent().type)

    // Create workflow record
    const workflow: Workflow = {
      id: nanoid(),
      taskId: task.id,
      phase,
      agentId: agentData.id,
      agentType: agentData.type,
      status: 'running',
      startTime: new Date().toISOString(),
      cost: 0,
      logs: [],
      context: previousContext,
      outputFiles: [],
    }

    store.createWorkflow(workflow)

    wsServer.broadcast({
      type: 'workflow:started',
      payload: workflow,
      timestamp: new Date().toISOString(),
    })

    // Update agent status
    store.updateAgent(agentData.id, { status: 'working', currentTaskId: task.id })

    wsServer.broadcast({
      type: 'agent:status-changed',
      payload: { ...agentData, status: 'working' },
      timestamp: new Date().toISOString(),
    })

    // Execute agent
    const context: AgentContext = {
      taskId: task.id,
      phase,
      previousPhaseContext: previousContext,
      files,
      requirements: task.description.split('\n').filter(Boolean),
    }

    const result = await agent.execute(context)

    // Update workflow with results
    const updatedWorkflow = store.updateWorkflow(workflow.id, {
      status: result.success ? 'completed' : 'failed',
      endTime: new Date().toISOString(),
      cost: result.cost,
      logs: result.logs,
      outputFiles: result.outputFiles,
      context: result.context,
    })

    if (updatedWorkflow) {
      wsServer.broadcast({
        type: 'workflow:completed',
        payload: updatedWorkflow,
        timestamp: new Date().toISOString(),
      })
    }

    // Update agent status
    store.updateAgent(agentData.id, {
      status: result.success ? 'completed' : 'error',
      currentTaskId: undefined,
    })

    return result
  }

  // Start orchestration in background
  startOrchestration(taskId: string): void {
    // Run orchestration asynchronously
    this.orchestrateTask(taskId).catch(error => {
      console.error('Orchestration error:', error)
    })
  }
}

export const orchestrator = new Orchestrator()
