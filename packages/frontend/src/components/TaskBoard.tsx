import { Component, createMemo, onMount, createSignal } from 'solid-js'
import { SDLCPhase } from '@agentic-taskboard/shared'
import { tasks, fetchTasks, fetchAgents, fetchCosts } from '../stores/tasks'
import { useWebSocket } from '../stores/websocket'
import SwimLane from './SwimLane'
import CreateTaskModal from './CreateTaskModal'

const phaseColors: Record<SDLCPhase, string> = {
  todo: 'var(--text-muted)',
  plan: 'var(--accent-plan)',
  build: 'var(--accent-build)',
  review: 'var(--accent-review)',
  test: 'var(--accent-test)',
  done: 'var(--accent-done)',
}

const phases: Array<{ id: SDLCPhase; title: string }> = [
  { id: 'todo', title: 'To Do' },
  { id: 'plan', title: 'Plan' },
  { id: 'build', title: 'Build' },
  { id: 'review', title: 'Review' },
  { id: 'test', title: 'Test' },
  { id: 'done', title: 'Done' },
]

const TaskBoard: Component = () => {
  const { connected } = useWebSocket()
  const [isCreateModalOpen, setIsCreateModalOpen] = createSignal(false)

  onMount(() => {
    fetchTasks()
    fetchAgents()
    fetchCosts()

    // Refresh data periodically
    const interval = setInterval(() => {
      fetchCosts()
    }, 5000)

    return () => clearInterval(interval)
  })

  const tasksByPhase = createMemo(() => {
    const byPhase: Record<SDLCPhase, typeof tasks> = {
      todo: () => [],
      plan: () => [],
      build: () => [],
      review: () => [],
      test: () => [],
      done: () => [],
    }

    tasks().forEach(task => {
      byPhase[task.status] = () => [...byPhase[task.status](), task]
    })

    return byPhase
  })

  return (
    <div style={{ padding: '1.5rem 0' }}>
      {/* Connection Status & Create Button */}
      <div style={{
        display: 'flex',
        'justify-content': 'space-between',
        'align-items': 'center',
        'margin-bottom': '1.5rem',
      }}>
        <div style={{
          display: 'flex',
          'align-items': 'center',
          gap: '0.5rem',
          'font-size': '0.875rem',
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            'border-radius': '50%',
            background: connected() ? 'var(--accent-build)' : 'var(--status-error)',
            'box-shadow': connected()
              ? '0 0 10px var(--accent-build)'
              : '0 0 10px var(--status-error)',
          }} />
          <span style={{ color: 'var(--text-secondary)' }}>
            {connected() ? 'Connected' : 'Disconnected'}
          </span>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'linear-gradient(135deg, var(--accent-plan), var(--accent-build))',
            border: 'none',
            'border-radius': '8px',
            color: 'var(--bg-primary)',
            'font-size': '0.875rem',
            'font-weight': '600',
            cursor: 'pointer',
            'box-shadow': 'var(--shadow-md)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = 'var(--shadow-lg)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'var(--shadow-md)'
          }}
        >
          + Create Task
        </button>
      </div>

      {/* Task Board Grid */}
      <div style={{
        display: 'grid',
        'grid-template-columns': 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1rem',
        'margin-bottom': '2rem',
      }}>
        {phases.map(phase => (
          <SwimLane
            phase={phase.id}
            title={phase.title}
            tasks={tasksByPhase()[phase.id]()}
            color={phaseColors[phase.id]}
          />
        ))}
      </div>

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={isCreateModalOpen()}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  )
}

export default TaskBoard
