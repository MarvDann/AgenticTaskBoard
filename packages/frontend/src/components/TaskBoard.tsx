import { Component, createMemo, onMount, createSignal } from 'solid-js'
import { SDLCPhase } from '@agentic-taskboard/shared'
import { tasks, fetchTasks, fetchAgents, fetchCosts } from '../stores/tasks'
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
    const byPhase: Record<SDLCPhase, Task[]> = {
      todo: [],
      plan: [],
      build: [],
      review: [],
      test: [],
      done: [],
    }

    tasks().forEach(task => {
      byPhase[task.status].push(task)
    })

    return byPhase
  })

  return (
    <div style={{
      display: 'flex',
      'flex-direction': 'column',
      flex: '1',
      padding: '1rem 1.5rem',
      overflow: 'hidden',
    }}>
      {/* Task Board Grid */}
      <div style={{
        display: 'grid',
        'grid-template-columns': 'repeat(6, minmax(220px, 1fr))',
        gap: '0.75rem',
        flex: '1',
        'overflow-x': 'auto',
        'overflow-y': 'hidden',
      }}>
        {phases.map(phase => (
          <SwimLane
            phase={phase.id}
            title={phase.title}
            tasks={tasksByPhase()[phase.id]}
            color={phaseColors[phase.id]}
            onCreateTask={phase.id === 'todo' ? () => setIsCreateModalOpen(true) : undefined}
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
