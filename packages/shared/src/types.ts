// SDLC Phase Types
export type SDLCPhase = 'todo' | 'plan' | 'build' | 'review' | 'test' | 'done'

export type AgentType = 'orchestrator' | 'planner' | 'builder' | 'reviewer' | 'tester'

export type AgentStatus = 'idle' | 'working' | 'completed' | 'error'

export type WorkflowStatus = 'pending' | 'running' | 'completed' | 'failed'

// Task Type
export interface Task {
  id: string
  title: string
  description: string
  status: SDLCPhase
  assignedAgent?: string
  model?: string
  codebasePath?: string
  createdAt: string
  updatedAt: string
  totalCost: number
  sessionCost: number
  logs: TaskLog[]
  context?: Record<string, unknown>
}

// Agent Type
export interface Agent {
  id: string
  name: string
  type: AgentType
  status: AgentStatus
  currentTaskId?: string
  createdAt: string
}

// Workflow Type
export interface Workflow {
  id: string
  taskId: string
  phase: SDLCPhase
  agentId: string
  agentType: AgentType
  status: WorkflowStatus
  startTime: string
  endTime?: string
  cost: number
  logs: WorkflowLog[]
  context: Record<string, unknown>
  outputFiles: string[]
}

// Tool Call Type
export interface ToolCall {
  id: string
  tool: string
  parameters: Record<string, unknown>
  timestamp: string
  cost: number
  duration?: number
  result?: unknown
}

// Task Log Type
export interface TaskLog {
  id: string
  timestamp: string
  agentId: string
  agentType: AgentType
  phase: SDLCPhase
  action: string
  message: string
  toolCalls: ToolCall[]
  files: string[]
  cost: number
}

// Workflow Log Type
export interface WorkflowLog {
  id: string
  timestamp: string
  level: 'info' | 'warning' | 'error' | 'success'
  message: string
  metadata?: Record<string, unknown>
}

// Cost Breakdown Type
export interface CostBreakdown {
  total: number
  byPhase: Record<SDLCPhase, number>
  byAgent: Record<string, number>
  byTask: Record<string, number>
}

// WebSocket Message Types
export type WSMessageType =
  | 'task:created'
  | 'task:updated'
  | 'task:deleted'
  | 'agent:created'
  | 'agent:updated'
  | 'agent:status-changed'
  | 'workflow:started'
  | 'workflow:updated'
  | 'workflow:completed'
  | 'cost:updated'
  | 'log:added'

export interface WSMessage<T = unknown> {
  type: WSMessageType
  payload: T
  timestamp: string
}

// API Request/Response Types
export interface CreateTaskRequest {
  title: string
  description: string
  model?: string
  codebasePath?: string
}

export interface UpdateTaskRequest {
  title?: string
  description?: string
  status?: SDLCPhase
  assignedAgent?: string
  model?: string
  codebasePath?: string
}

export interface AssignAgentRequest {
  taskId: string
  startAutomatically?: boolean
}

export interface CreateTaskResponse {
  task: Task
}

export interface GetTasksResponse {
  tasks: Task[]
}

export interface GetAgentsResponse {
  agents: Agent[]
}

export interface GetCostBreakdownResponse {
  costs: CostBreakdown
}

// Agent Orchestration Types
export interface AgentContext {
  taskId: string
  phase: SDLCPhase
  previousPhaseContext?: Record<string, unknown>
  files: string[]
  requirements: string[]
}

export interface AgentResult {
  success: boolean
  phase: SDLCPhase
  context: Record<string, unknown>
  outputFiles: string[]
  logs: WorkflowLog[]
  cost: number
  error?: string
}

// Model pricing (tokens per million)
export interface ModelPricing {
  inputTokensPerMillion: number
  outputTokensPerMillion: number
}

export const MODEL_PRICING: Record<string, ModelPricing> = {
  'claude-sonnet-4-5-20250929': {
    inputTokensPerMillion: 3.00,
    outputTokensPerMillion: 15.00,
  },
  'claude-3-5-sonnet-20241022': {
    inputTokensPerMillion: 3.00,
    outputTokensPerMillion: 15.00,
  },
  'claude-opus-4-20250514': {
    inputTokensPerMillion: 15.00,
    outputTokensPerMillion: 75.00,
  },
  'claude-3-5-haiku-20241022': {
    inputTokensPerMillion: 1.00,
    outputTokensPerMillion: 5.00,
  },
}

// Cost calculation helper
export function calculateCost(
  inputTokens: number,
  outputTokens: number,
  model: string
): number {
  const pricing = MODEL_PRICING[model] || MODEL_PRICING['claude-sonnet-4-5-20250929']
  const inputCost = (inputTokens / 1_000_000) * pricing.inputTokensPerMillion
  const outputCost = (outputTokens / 1_000_000) * pricing.outputTokensPerMillion
  return inputCost + outputCost
}
