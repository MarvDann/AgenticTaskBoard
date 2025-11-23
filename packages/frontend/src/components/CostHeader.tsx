import { Component } from 'solid-js'
import { costs } from '../stores/tasks'
import { useWebSocket } from '../stores/websocket'

const CostHeader: Component = () => {
  const { connected } = useWebSocket()

  return (
    <header style={{
      background: 'var(--bg-secondary)',
      'border-bottom': '1px solid rgba(255, 255, 255, 0.1)',
      padding: '0.875rem 1.5rem',
      'margin-bottom': '0',
      display: 'flex',
      'justify-content': 'space-between',
      'align-items': 'center',
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

      {/* Connection Indicator */}
      <div style={{
        display: 'flex',
        'align-items': 'center',
        gap: '0.5rem',
        'font-size': '0.75rem',
        color: 'var(--text-secondary)',
      }}>
        <div style={{
          width: '8px',
          height: '8px',
          'border-radius': '50%',
          background: connected() ? '#10b981' : '#ef4444',
          'box-shadow': connected()
            ? '0 0 8px rgba(16, 185, 129, 0.6)'
            : '0 0 8px rgba(239, 68, 68, 0.6)',
        }} />
        <span style={{ 'text-transform': 'uppercase', 'letter-spacing': '0.05em' }}>
          {connected() ? 'Connected' : 'Disconnected'}
        </span>
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
