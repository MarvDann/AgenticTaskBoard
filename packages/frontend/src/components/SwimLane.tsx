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
  // Determine if we should use dark or light text based on the color
  const getTextColor = () => {
    if (props.phase === 'todo') return '#000'
    return '#fff'
  }

  return (
    <div
      style={{
        background: 'var(--bg-secondary)',
        'border-radius': '8px',
        'min-height': '500px',
        display: 'flex',
        'flex-direction': 'column',
        overflow: 'hidden',
        'box-shadow': 'var(--shadow-md)',
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        'align-items': 'center',
        'justify-content': 'space-between',
        padding: '0.875rem 1rem',
        background: props.color,
      }}>
        <div style={{
          display: 'flex',
          'align-items': 'center',
          gap: '0.5rem',
        }}>
          <h2 style={{
            'font-size': '0.875rem',
            'font-weight': '700',
            color: getTextColor(),
            'text-transform': 'uppercase',
            'letter-spacing': '0.05em',
            margin: '0',
          }}>
            {props.title}
          </h2>
        </div>
        <div style={{
          background: 'rgba(0, 0, 0, 0.2)',
          color: getTextColor(),
          'font-weight': '700',
          'font-size': '0.75rem',
          padding: '0.25rem 0.625rem',
          'border-radius': '12px',
          'min-width': '1.75rem',
          'text-align': 'center',
        }}>
          {props.tasks.length}
        </div>
      </div>

      {/* Tasks */}
      <div style={{
        flex: '1',
        'overflow-y': 'auto',
        padding: '0.75rem',
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
            No tickets
          </div>
        )}
      </div>
    </div>
  )
}

export default SwimLane
