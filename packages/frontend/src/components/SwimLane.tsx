import { Component, For } from 'solid-js'
import { Task, SDLCPhase } from '@agentic-taskboard/shared'
import TaskCard from './TaskCard'

interface SwimLaneProps {
  phase: SDLCPhase
  title: string
  tasks: Task[]
  color: string
}

const phaseIcons: Record<SDLCPhase, string> = {
  todo: '📋',
  plan: '🎯',
  build: '🔨',
  review: '👁️',
  test: '🧪',
  done: '✅',
}

const SwimLane: Component<SwimLaneProps> = props => {
  return (
    <div
      style={{
        background: 'var(--bg-secondary)',
        border: `1px solid ${props.color}44`,
        'border-radius': '10px',
        padding: '0.75rem',
        'min-height': '500px',
        display: 'flex',
        'flex-direction': 'column',
        'box-shadow': 'var(--shadow-md)',
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        'align-items': 'center',
        'justify-content': 'space-between',
        'margin-bottom': '1rem',
        padding: '0.75rem',
        background: `linear-gradient(135deg, ${props.color}22, ${props.color}11)`,
        'border-radius': '8px',
        border: `1px solid ${props.color}`,
      }}>
        <div style={{
          display: 'flex',
          'align-items': 'center',
          gap: '0.5rem',
        }}>
          <span style={{ 'font-size': '1.25rem' }}>{phaseIcons[props.phase]}</span>
          <h2 style={{
            'font-size': '0.875rem',
            'font-weight': '700',
            color: props.color,
            'text-transform': 'uppercase',
            'letter-spacing': '0.05em',
          }}>
            {props.title}
          </h2>
        </div>
        <div style={{
          background: props.color,
          color: 'var(--bg-primary)',
          'font-weight': '700',
          'font-size': '0.75rem',
          padding: '0.25rem 0.5rem',
          'border-radius': '12px',
          'min-width': '1.5rem',
          'text-align': 'center',
        }}>
          {props.tasks.length}
        </div>
      </div>

      {/* Tasks */}
      <div style={{
        flex: '1',
        'overflow-y': 'auto',
        'padding-right': '0.25rem',
      }}>
        <For each={props.tasks}>
          {task => <TaskCard task={task} />}
        </For>

        {/* Empty State */}
        {props.tasks.length === 0 && (
          <div style={{
            display: 'flex',
            'align-items': 'center',
            'justify-content': 'center',
            height: '200px',
            color: 'var(--text-muted)',
            'font-size': '0.875rem',
            'text-align': 'center',
          }}>
            No tasks in {props.title.toLowerCase()}
          </div>
        )}
      </div>
    </div>
  )
}

export default SwimLane
