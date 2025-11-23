import { Component } from 'solid-js'
import { costs } from '../stores/tasks'

const CostHeader: Component = () => {
  return (
    <header style={{
      background: 'var(--bg-secondary)',
      'border-bottom': '3px solid var(--border-bright)',
      padding: '1.25rem 1.5rem',
      'margin-bottom': '1.5rem',
      display: 'flex',
      'justify-content': 'space-between',
      'align-items': 'center',
      'box-shadow': '0 4px 6px rgba(0, 0, 0, 0.3)',
    }}>
      <div style={{ display: 'flex', 'align-items': 'center', gap: '2rem' }}>
        <h1 style={{
          'font-size': '1.5rem',
          'font-weight': '700',
          color: 'var(--text-primary)',
          margin: '0',
        }}>
          🤖 Agentic TaskBoard
        </h1>
        <div style={{
          'font-size': '0.875rem',
          color: 'var(--text-secondary)',
          'border-left': '2px solid var(--border-subtle)',
          'padding-left': '1.5rem',
        }}>
          Plan → Build → Review → Ship
        </div>
      </div>

      <div style={{
        display: 'flex',
        gap: '1.5rem',
        'align-items': 'center',
      }}>
        {/* Phase Breakdown */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          'font-size': '0.75rem',
          'font-family': 'var(--font-mono)',
        }}>
          <div style={{ 'text-align': 'center' }}>
            <div style={{ color: 'var(--text-muted)', 'margin-bottom': '0.25rem' }}>Plan</div>
            <div style={{ color: 'var(--accent-plan)', 'font-weight': '700' }}>
              ${costs().byPhase.plan.toFixed(2)}
            </div>
          </div>
          <div style={{ 'text-align': 'center' }}>
            <div style={{ color: 'var(--text-muted)', 'margin-bottom': '0.25rem' }}>Build</div>
            <div style={{ color: 'var(--accent-build)', 'font-weight': '700' }}>
              ${costs().byPhase.build.toFixed(2)}
            </div>
          </div>
          <div style={{ 'text-align': 'center' }}>
            <div style={{ color: 'var(--text-muted)', 'margin-bottom': '0.25rem' }}>Review</div>
            <div style={{ color: 'var(--accent-review)', 'font-weight': '700' }}>
              ${costs().byPhase.review.toFixed(2)}
            </div>
          </div>
          <div style={{ 'text-align': 'center' }}>
            <div style={{ color: 'var(--text-muted)', 'margin-bottom': '0.25rem' }}>Test</div>
            <div style={{ color: 'var(--accent-test)', 'font-weight': '700' }}>
              ${costs().byPhase.test.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Total Cost */}
        <div style={{
          'text-align': 'right',
          'border-left': '2px solid var(--border-subtle)',
          'padding-left': '1.5rem',
        }}>
          <div style={{
            'font-size': '0.7rem',
            color: 'var(--text-muted)',
            'text-transform': 'uppercase',
            'letter-spacing': '0.05em',
            'margin-bottom': '0.25rem',
          }}>
            Total Cost
          </div>
          <div style={{
            'font-size': '1.5rem',
            'font-weight': '700',
            'font-family': 'var(--font-mono)',
            color: 'var(--accent-build)',
          }}>
            ${costs().total.toFixed(2)}
          </div>
        </div>
      </div>
    </header>
  )
}

export default CostHeader
