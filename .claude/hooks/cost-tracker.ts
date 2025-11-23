/**
 * Cost Tracker Hook
 *
 * This hook tracks AI inference costs in real-time.
 * It monitors:
 * - Input/output tokens
 * - Model used
 * - Cost per request
 * - Cumulative session cost
 *
 * Usage: This hook automatically runs after each AI inference
 */

interface InferenceEvent {
  model: string
  inputTokens: number
  outputTokens: number
  timestamp: string
}

// Model pricing (per million tokens)
const MODEL_PRICING: Record<string, { input: number; output: number }> = {
  'claude-sonnet-4-5-20250929': { input: 3.00, output: 15.00 },
  'claude-3-5-sonnet-20241022': { input: 3.00, output: 15.00 },
  'claude-opus-4-20250514': { input: 15.00, output: 75.00 },
  'claude-3-5-haiku-20241022': { input: 1.00, output: 5.00 },
}

let sessionCost = 0
let sessionTokens = { input: 0, output: 0 }

export async function onInference(event: InferenceEvent) {
  const pricing = MODEL_PRICING[event.model] || MODEL_PRICING['claude-sonnet-4-5-20250929']

  const inputCost = (event.inputTokens / 1_000_000) * pricing.input
  const outputCost = (event.outputTokens / 1_000_000) * pricing.output
  const totalCost = inputCost + outputCost

  sessionCost += totalCost
  sessionTokens.input += event.inputTokens
  sessionTokens.output += event.outputTokens

  // Log cost information
  console.log('\n💰 COST TRACKING')
  console.log('  Model:', event.model)
  console.log('  Input Tokens:', event.inputTokens.toLocaleString())
  console.log('  Output Tokens:', event.outputTokens.toLocaleString())
  console.log('  Cost:', `$${totalCost.toFixed(4)}`)
  console.log('  Session Total:', `$${sessionCost.toFixed(4)}`)
  console.log('─'.repeat(60))

  // In a production system, send cost data to backend API
  // await fetch('http://localhost:3001/api/costs/track', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({
  //     cost: totalCost,
  //     sessionCost,
  //     model: event.model,
  //     inputTokens: event.inputTokens,
  //     outputTokens: event.outputTokens,
  //     timestamp: event.timestamp,
  //   }),
  // })
}

export function getSessionCost(): number {
  return sessionCost
}

export function getSessionTokens(): { input: number; output: number } {
  return sessionTokens
}

export function resetSession(): void {
  sessionCost = 0
  sessionTokens = { input: 0, output: 0 }
}
