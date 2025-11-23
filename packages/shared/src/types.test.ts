import { describe, it, expect } from 'vitest'
import { calculateCost, MODEL_PRICING } from './types'

describe('Cost Calculation', () => {
  it('should calculate cost for Sonnet 4.5', () => {
    const cost = calculateCost(1_000_000, 1_000_000, 'claude-sonnet-4-5-20250929')
    // Input: 1M tokens * $3/M = $3
    // Output: 1M tokens * $15/M = $15
    // Total: $18
    expect(cost).toBe(18.00)
  })

  it('should calculate cost for partial tokens', () => {
    const cost = calculateCost(100_000, 50_000, 'claude-sonnet-4-5-20250929')
    // Input: 100K tokens * $3/M = $0.30
    // Output: 50K tokens * $15/M = $0.75
    // Total: $1.05
    expect(cost).toBe(1.05)
  })

  it('should use default pricing for unknown model', () => {
    const cost = calculateCost(1_000_000, 1_000_000, 'unknown-model')
    // Should default to Sonnet 4.5 pricing
    expect(cost).toBe(18.00)
  })

  it('should handle zero tokens', () => {
    const cost = calculateCost(0, 0, 'claude-sonnet-4-5-20250929')
    expect(cost).toBe(0)
  })
})

describe('Model Pricing', () => {
  it('should have pricing for all major models', () => {
    expect(MODEL_PRICING['claude-sonnet-4-5-20250929']).toBeDefined()
    expect(MODEL_PRICING['claude-3-5-sonnet-20241022']).toBeDefined()
    expect(MODEL_PRICING['claude-opus-4-20250514']).toBeDefined()
    expect(MODEL_PRICING['claude-3-5-haiku-20241022']).toBeDefined()
  })

  it('should have correct Haiku pricing (cheapest)', () => {
    const haiku = MODEL_PRICING['claude-3-5-haiku-20241022']
    expect(haiku.inputTokensPerMillion).toBe(1.00)
    expect(haiku.outputTokensPerMillion).toBe(5.00)
  })

  it('should have correct Opus pricing (most expensive)', () => {
    const opus = MODEL_PRICING['claude-opus-4-20250514']
    expect(opus.inputTokensPerMillion).toBe(15.00)
    expect(opus.outputTokensPerMillion).toBe(75.00)
  })
})
