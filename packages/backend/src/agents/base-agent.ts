import {
  Agent,
  AgentContext,
  AgentResult,
  WorkflowLog,
  SDLCPhase,
  AgentType,
} from '@agentic-taskboard/shared'
import { nanoid } from 'nanoid'

export abstract class BaseAgent {
  protected agent: Agent
  protected logs: WorkflowLog[] = []
  protected totalCost = 0

  constructor(name: string, type: AgentType) {
    this.agent = {
      id: nanoid(),
      name,
      type,
      status: 'idle',
      createdAt: new Date().toISOString(),
    }
  }

  protected log(level: WorkflowLog['level'], message: string, metadata?: Record<string, unknown>) {
    const log: WorkflowLog = {
      id: nanoid(),
      timestamp: new Date().toISOString(),
      level,
      message,
      metadata,
    }
    this.logs.push(log)
    console.log(`[${this.agent.type.toUpperCase()}] ${message}`, metadata || '')
  }

  protected addCost(cost: number) {
    this.totalCost += cost
  }

  abstract execute(context: AgentContext): Promise<AgentResult>

  getAgent(): Agent {
    return this.agent
  }

  getCost(): number {
    return this.totalCost
  }

  getLogs(): WorkflowLog[] {
    return this.logs
  }

  protected createResult(
    success: boolean,
    phase: SDLCPhase,
    context: Record<string, unknown>,
    outputFiles: string[] = [],
    error?: string
  ): AgentResult {
    return {
      success,
      phase,
      context,
      outputFiles,
      logs: this.logs,
      cost: this.totalCost,
      error,
    }
  }
}
