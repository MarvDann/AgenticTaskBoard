import { Component, Show } from 'solid-js'
import { Task } from '@agentic-taskboard/shared'
import { assignAgent, deleteTask } from '../stores/tasks'

interface TaskCardProps {
  task: Task
}

const phaseColors: Record<Task['status'], string> = {
  todo: 'var(--text-muted)',
  plan: 'var(--accent-plan)',
  build: 'var(--accent-build)',
  review: 'var(--accent-review)',
  test: 'var(--accent-test)',
  done: 'var(--accent-done)',
}

const TaskCard: Component<TaskCardProps> = props => {
  const handleAssignAgent = async () => {
    await assignAgent(props.task.id)
  }

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this task?')) {
      await deleteTask(props.task.id)
    }
  }

  return (
    <div
      class="task-card animate-fade-in"
      style={{
        background: 'var(--bg-card)',
        border: `1px solid ${phaseColors[props.task.status]}`,
        'border-radius': '6px',
        padding: '0.65rem',
        'margin-bottom': '0.5rem',
        cursor: 'grab',
        transition: 'all 0.2s ease',
        'box-shadow': 'var(--shadow-sm)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.boxShadow = 'var(--shadow-md)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        'justify-content': 'space-between',
        'align-items': 'flex-start',
        'margin-bottom': '0.5rem',
      }}>
        <h3 style={{
          'font-size': '0.8rem',
          'font-weight': '600',
          color: 'var(--text-primary)',
          flex: '1',
          'line-height': '1.3',
        }}>
          {props.task.title}
        </h3>
        <button
          onClick={handleDelete}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '0',
            'font-size': '1rem',
            'line-height': '1',
          }}
          title="Delete task"
        >
          ×
        </button>
      </div>

      {/* Description */}
      <p style={{
        'font-size': '0.7rem',
        color: 'var(--text-secondary)',
        'margin-bottom': '0.5rem',
        'line-height': '1.3',
        'white-space': 'pre-wrap',
      }}>
        {props.task.description.length > 70
          ? props.task.description.substring(0, 70) + '...'
          : props.task.description}
      </p>

      {/* Footer */}
      <div style={{
        display: 'flex',
        'justify-content': 'space-between',
        'align-items': 'center',
        'font-size': '0.75rem',
      }}>
        <div style={{
          display: 'flex',
          'align-items': 'center',
          gap: '0.5rem',
        }}>
          <Show when={props.task.assignedAgent}>
            <span
              class="animate-pulse"
              style={{
                color: 'var(--accent-build)',
                'font-weight': '600',
              }}
            >
              🤖 Agent Working
            </span>
          </Show>
          <Show when={!props.task.assignedAgent && props.task.status === 'todo'}>
            <button
              onClick={handleAssignAgent}
              style={{
                background: 'var(--accent-plan)',
                color: 'var(--bg-primary)',
                border: 'none',
                padding: '0.25rem 0.6rem',
                'border-radius': '4px',
                cursor: 'pointer',
                'font-size': '0.7rem',
                'font-weight': '600',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'scale(1.05)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'scale(1)'
              }}
            >
              Assign Agent
            </button>
          </Show>
        </div>

        <div style={{
          'font-family': 'var(--font-mono)',
          color: 'var(--text-muted)',
          'font-size': '0.7rem',
        }}>
          ${props.task.totalCost.toFixed(2)}
        </div>
      </div>
    </div>
  )
}

export default TaskCard
