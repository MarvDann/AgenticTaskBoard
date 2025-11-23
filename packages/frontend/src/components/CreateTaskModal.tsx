import { Component, createSignal, Show } from 'solid-js'
import { createTask } from '../stores/tasks'

interface CreateTaskModalProps {
  isOpen: boolean
  onClose: () => void
}

const CreateTaskModal: Component<CreateTaskModalProps> = props => {
  const [title, setTitle] = createSignal('')
  const [description, setDescription] = createSignal('')
  const [submitting, setSubmitting] = createSignal(false)

  const handleSubmit = async (e: Event) => {
    e.preventDefault()

    if (!title().trim()) {
      return
    }

    setSubmitting(true)
    try {
      await createTask({
        title: title(),
        description: description(),
      })
      setTitle('')
      setDescription('')
      props.onClose()
    } catch (error) {
      console.error('Error creating task:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleBackdropClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      props.onClose()
    }
  }

  return (
    <Show when={props.isOpen}>
      <div
        onClick={handleBackdropClick}
        style={{
          position: 'fixed',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          background: 'rgba(0, 0, 0, 0.85)',
          display: 'flex',
          'align-items': 'center',
          'justify-content': 'center',
          'z-index': '1000',
          padding: '1rem',
        }}
      >
        <div
          class="animate-fade-in"
          style={{
            background: '#1a1f2e',
            border: '2px solid var(--accent-plan)',
            'border-radius': '12px',
            padding: '2rem',
            'max-width': '500px',
            width: '100%',
            'box-shadow': '0 0 40px rgba(0, 212, 255, 0.5)',
          }}
        >
          <h2 style={{
            'font-size': '1.5rem',
            'font-weight': '700',
            'margin-bottom': '1.5rem',
            color: 'var(--text-primary)',
          }}>
            Create New Task
          </h2>

          <form onSubmit={handleSubmit}>
            {/* Title Input */}
            <div style={{ 'margin-bottom': '1rem' }}>
              <label style={{
                display: 'block',
                'font-size': '0.875rem',
                'font-weight': '600',
                color: 'var(--text-secondary)',
                'margin-bottom': '0.5rem',
              }}>
                Title *
              </label>
              <input
                type="text"
                value={title()}
                onInput={e => setTitle(e.currentTarget.value)}
                placeholder="Enter task title..."
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'var(--bg-tertiary)',
                  border: '2px solid var(--border-subtle)',
                  'border-radius': '6px',
                  color: 'var(--text-primary)',
                  'font-size': '0.875rem',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => {
                  e.currentTarget.style.borderColor = 'var(--accent-plan)'
                }}
                onBlur={e => {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)'
                }}
              />
            </div>

            {/* Description Textarea */}
            <div style={{ 'margin-bottom': '1.5rem' }}>
              <label style={{
                display: 'block',
                'font-size': '0.875rem',
                'font-weight': '600',
                color: 'var(--text-secondary)',
                'margin-bottom': '0.5rem',
              }}>
                Description
              </label>
              <textarea
                value={description()}
                onInput={e => setDescription(e.currentTarget.value)}
                placeholder="Enter task description and requirements..."
                rows={6}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'var(--bg-tertiary)',
                  border: '2px solid var(--border-subtle)',
                  'border-radius': '6px',
                  color: 'var(--text-primary)',
                  'font-size': '0.875rem',
                  'font-family': 'var(--font-sans)',
                  resize: 'vertical',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => {
                  e.currentTarget.style.borderColor = 'var(--accent-plan)'
                }}
                onBlur={e => {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)'
                }}
              />
            </div>

            {/* Buttons */}
            <div style={{
              display: 'flex',
              gap: '0.75rem',
              'justify-content': 'flex-end',
            }}>
              <button
                type="button"
                onClick={props.onClose}
                disabled={submitting()}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'var(--bg-tertiary)',
                  border: '2px solid var(--border-subtle)',
                  'border-radius': '6px',
                  color: 'var(--text-secondary)',
                  'font-size': '0.875rem',
                  'font-weight': '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting() || !title().trim()}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'var(--accent-plan)',
                  border: 'none',
                  'border-radius': '6px',
                  color: 'var(--bg-primary)',
                  'font-size': '0.875rem',
                  'font-weight': '600',
                  cursor: submitting() || !title().trim() ? 'not-allowed' : 'pointer',
                  opacity: submitting() || !title().trim() ? '0.5' : '1',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  if (!submitting() && title().trim()) {
                    e.currentTarget.style.transform = 'scale(1.05)'
                  }
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'scale(1)'
                }}
              >
                {submitting() ? 'Creating...' : 'Create Task'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Show>
  )
}

export default CreateTaskModal
