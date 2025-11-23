import { Component, createMemo, onMount, createSignal } from 'solid-js'
import { SDLCPhase } from '@agentic-taskboard/shared'
import { tasks, fetchTasks, fetchAgents, fetchCosts } from '../stores/tasks'
import { useWebSocket } from '../stores/websocket'
import SwimLane from './SwimLane'
import CreateTaskModal from './CreateTaskModal'

const phaseColors: Record<SDLCPhase, string> = {
  todo: '#6B7280',
  plan: '#3B82F6',
  build: '#10B981',
  review: '#F59E0B',
  test: '#EC4899',
  done: '#8B5CF6',
}

const phases: Array<{ id: SDLCPhase; title: string }> = [
  { id: 'todo', title: 'IDLE' },
  { id: 'plan', title: 'PLAN' },
  { id: 'build', title: 'BUILD' },
  { id: 'review', title: 'REVIEW' },
  { id: 'test', title: 'TEST' },
  { id: 'done', title: 'SHIPPED' },
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
            background: '#3B82F6',
            border: 'none',
            'border-radius': '6px',
            color: '#fff',
            'font-size': '0.875rem',
            'font-weight': '600',
            cursor: 'pointer',
            'box-shadow': 'var(--shadow-md)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#2563EB'
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = 'var(--shadow-lg)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = '#3B82F6'
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'var(--shadow-md)'
          }}
        >
          + New Ticket
        </button>
      </div>

      {/* Task Board Grid */}
      <div style={{
        display: 'grid',
        'grid-template-columns': 'repeat(6, minmax(220px, 1fr))',
        gap: '0.75rem',
        'margin-bottom': '2rem',
        'overflow-x': 'auto',
        'padding-bottom': '1rem',
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
