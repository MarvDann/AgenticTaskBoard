import { Component } from 'solid-js'
import { costs } from '../stores/tasks'

const CostHeader: Component = () => {
  return (
    <header style={{
      background: 'var(--bg-secondary)',
      border: '2px solid var(--border-bright)',
      'border-radius': '8px',
      padding: '1rem 1.5rem',
      'margin-bottom': '1.5rem',
      display: 'flex',
      'justify-content': 'space-between',
      'align-items': 'center',
      'flex-wrap': 'wrap',
      gap: '1rem',
      'box-shadow': 'var(--shadow-md)',
    }}>
      <div>
        <h1 style={{
          'font-size': '1.25rem',
          'font-weight': '700',
          'margin-bottom': '0.25rem',
          background: 'linear-gradient(135deg, var(--accent-plan), var(--accent-build))',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
        }}>
          🤖 Agentic TaskBoard
        </h1>
        <p style={{
          'font-size': '0.75rem',
          color: 'var(--text-secondary)',
        }}>
          AI-powered SDLC orchestration with full observability
        </p>
      </div>

      <div style={{
        display: 'flex',
        gap: '2rem',
        'align-items': 'center',
      }}>
        {/* Total Cost */}
        <div style={{ 'text-align': 'right' }}>
          <div style={{
            'font-size': '0.65rem',
            color: 'var(--text-muted)',
            'text-transform': 'uppercase',
            'letter-spacing': '0.05em',
            'margin-bottom': '0.25rem',
          }}>
            Total Cost
          </div>
          <div style={{
            'font-size': '1.25rem',
            'font-weight': '700',
            'font-family': 'var(--font-mono)',
            color: 'var(--accent-build)',
          }}>
            ${costs().total.toFixed(2)}
          </div>
        </div>

        {/* Phase Breakdown */}
        <div style={{
          display: 'flex',
          gap: '0.75rem',
          'font-size': '0.7rem',
          'font-family': 'var(--font-mono)',
        }}>
          <div style={{ 'text-align': 'center' }}>
            <div style={{ color: 'var(--text-muted)' }}>Plan</div>
            <div style={{ color: 'var(--accent-plan)', 'font-weight': '600' }}>
              ${costs().byPhase.plan.toFixed(2)}
            </div>
          </div>
          <div style={{ 'text-align': 'center' }}>
            <div style={{ color: 'var(--text-muted)' }}>Build</div>
            <div style={{ color: 'var(--accent-build)', 'font-weight': '600' }}>
              ${costs().byPhase.build.toFixed(2)}
            </div>
          </div>
          <div style={{ 'text-align': 'center' }}>
            <div style={{ color: 'var(--text-muted)' }}>Review</div>
            <div style={{ color: 'var(--accent-review)', 'font-weight': '600' }}>
              ${costs().byPhase.review.toFixed(2)}
            </div>
          </div>
          <div style={{ 'text-align': 'center' }}>
            <div style={{ color: 'var(--text-muted)' }}>Test</div>
            <div style={{ color: 'var(--accent-test)', 'font-weight': '600' }}>
              ${costs().byPhase.test.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default CostHeader
