import { Component, createSignal, Show } from 'solid-js'
import { createTask } from '../stores/tasks'

interface CreateTaskModalProps {
  isOpen: boolean
  onClose: () => void
}

const CreateTaskModal: Component<CreateTaskModalProps> = props => {
  const [title, setTitle] = createSignal('')
  const [model, setModel] = createSignal('sonnet')
  const [codebasePath, setCodebasePath] = createSignal('.')
  const [userRequestPrompt, setUserRequestPrompt] = createSignal('')
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
        description: userRequestPrompt(),
        model: model(),
        codebasePath: codebasePath(),
      })
      setTitle('')
      setUserRequestPrompt('')
      setModel('sonnet')
      setCodebasePath('.')
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
            background: '#1f2937',
            'border-radius': '12px',
            padding: '0',
            'max-width': '600px',
            width: '100%',
            'box-shadow': '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div style={{
            display: 'flex',
            'align-items': 'center',
            'justify-content': 'space-between',
            padding: '1.5rem',
            'border-bottom': '1px solid rgba(255, 255, 255, 0.1)',
          }}>
            <h2 style={{
              'font-size': '1.25rem',
              'font-weight': '600',
              color: '#f9fafb',
              margin: '0',
              'font-family': 'Inter, sans-serif',
            }}>
              Create New Ticket
            </h2>
            <button
              onClick={props.onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#9ca3af',
                'font-size': '1.5rem',
                cursor: 'pointer',
                padding: '0',
                'line-height': '1',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = '#f9fafb'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = '#9ca3af'
              }}
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ padding: '1.5rem', display: 'flex', 'flex-direction': 'column', gap: '1.25rem' }}>
              {/* Title Input */}
              <div>
                <label style={{
                  display: 'block',
                  'font-size': '0.875rem',
                  'font-weight': '500',
                  color: '#d1d5db',
                  'margin-bottom': '0.5rem',
                  'font-family': 'Inter, sans-serif',
                }}>
                  Title
                </label>
                <input
                  type="text"
                  value={title()}
                  onInput={e => setTitle(e.currentTarget.value)}
                  placeholder="Brief description of the task"
                  required
                  style={{
                    width: '100%',
                    padding: '0.625rem 0.875rem',
                    background: '#374151',
                    border: '1px solid #4b5563',
                    'border-radius': '6px',
                    color: '#f9fafb',
                    'font-size': '0.875rem',
                    'font-family': 'Inter, sans-serif',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={e => {
                    e.currentTarget.style.borderColor = '#3b82f6'
                  }}
                  onBlur={e => {
                    e.currentTarget.style.borderColor = '#4b5563'
                  }}
                />
              </div>

              {/* Model Dropdown */}
              <div>
                <label style={{
                  display: 'block',
                  'font-size': '0.875rem',
                  'font-weight': '500',
                  color: '#d1d5db',
                  'margin-bottom': '0.5rem',
                  'font-family': 'Inter, sans-serif',
                }}>
                  Model
                </label>
                <select
                  value={model()}
                  onChange={e => setModel(e.currentTarget.value)}
                  style={{
                    width: '100%',
                    padding: '0.625rem 0.875rem',
                    background: '#374151',
                    border: '1px solid #4b5563',
                    'border-radius': '6px',
                    color: '#f9fafb',
                    'font-size': '0.875rem',
                    'font-family': 'Inter, sans-serif',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={e => {
                    e.currentTarget.style.borderColor = '#3b82f6'
                  }}
                  onBlur={e => {
                    e.currentTarget.style.borderColor = '#4b5563'
                  }}
                >
                  <option value="sonnet">Sonnet (Faster)</option>
                  <option value="opus">Opus (Most Capable)</option>
                  <option value="haiku">Haiku (Fastest)</option>
                </select>
              </div>

              {/* Codebase Path */}
              <div style={{ display: 'grid', 'grid-template-columns': '1fr auto', gap: '0.75rem' }}>
                <div>
                  <label style={{
                    display: 'block',
                    'font-size': '0.875rem',
                    'font-weight': '500',
                    color: '#d1d5db',
                    'margin-bottom': '0.5rem',
                    'font-family': 'Inter, sans-serif',
                  }}>
                    Codebase Path
                  </label>
                  <input
                    type="text"
                    value={codebasePath()}
                    onInput={e => setCodebasePath(e.currentTarget.value)}
                    placeholder="."
                    style={{
                      width: '100%',
                      padding: '0.625rem 0.875rem',
                      background: '#374151',
                      border: '1px solid #4b5563',
                      'border-radius': '6px',
                      color: '#f9fafb',
                      'font-size': '0.875rem',
                      'font-family': 'SF Mono, Consolas, monospace',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={e => {
                      e.currentTarget.style.borderColor = '#3b82f6'
                    }}
                    onBlur={e => {
                      e.currentTarget.style.borderColor = '#4b5563'
                    }}
                  />
                </div>
                <div>
                  <label style={{
                    display: 'block',
                    'font-size': '0.875rem',
                    'font-weight': '500',
                    color: 'transparent',
                    'margin-bottom': '0.5rem',
                    'user-select': 'none',
                  }}>
                    _
                  </label>
                  <select
                    value={codebasePath()}
                    onChange={e => setCodebasePath(e.currentTarget.value)}
                    style={{
                      padding: '0.625rem 0.875rem',
                      background: '#374151',
                      border: '1px solid #4b5563',
                      'border-radius': '6px',
                      color: '#f9fafb',
                      'font-size': '0.875rem',
                      'font-family': 'Inter, sans-serif',
                      cursor: 'pointer',
                      'min-width': '150px',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={e => {
                      e.currentTarget.style.borderColor = '#3b82f6'
                    }}
                    onBlur={e => {
                      e.currentTarget.style.borderColor = '#4b5563'
                    }}
                  >
                    <option value=".">. (current)</option>
                    <option value="./packages">./packages</option>
                    <option value="./src">./src</option>
                  </select>
                </div>
              </div>

              {/* User Request Prompt */}
              <div>
                <label style={{
                  display: 'block',
                  'font-size': '0.875rem',
                  'font-weight': '500',
                  color: '#d1d5db',
                  'margin-bottom': '0.5rem',
                  'font-family': 'Inter, sans-serif',
                }}>
                  User Request Prompt
                </label>
                <textarea
                  value={userRequestPrompt()}
                  onInput={e => setUserRequestPrompt(e.currentTarget.value)}
                  placeholder="Describe what you want the agents to plan, build, and review..."
                  rows={8}
                  style={{
                    width: '100%',
                    padding: '0.625rem 0.875rem',
                    background: '#374151',
                    border: '1px solid #4b5563',
                    'border-radius': '6px',
                    color: '#f9fafb',
                    'font-size': '0.875rem',
                    'font-family': 'Inter, sans-serif',
                    resize: 'vertical',
                    'line-height': '1.5',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={e => {
                    e.currentTarget.style.borderColor = '#3b82f6'
                  }}
                  onBlur={e => {
                    e.currentTarget.style.borderColor = '#4b5563'
                  }}
                />
              </div>
            </div>

            {/* Footer Buttons */}
            <div style={{
              display: 'flex',
              gap: '0.75rem',
              'justify-content': 'flex-end',
              padding: '1rem 1.5rem',
              'border-top': '1px solid rgba(255, 255, 255, 0.1)',
              background: '#1a1f2e',
            }}>
              <button
                type="button"
                onClick={props.onClose}
                disabled={submitting()}
                style={{
                  padding: '0.625rem 1.25rem',
                  background: 'transparent',
                  border: '1px solid #4b5563',
                  'border-radius': '6px',
                  color: '#d1d5db',
                  'font-size': '0.875rem',
                  'font-weight': '500',
                  'font-family': 'Inter, sans-serif',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#374151'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent'
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting() || !title().trim()}
                style={{
                  padding: '0.625rem 1.25rem',
                  background: submitting() || !title().trim() ? '#4b5563' : '#3b82f6',
                  border: 'none',
                  'border-radius': '6px',
                  color: '#ffffff',
                  'font-size': '0.875rem',
                  'font-weight': '500',
                  'font-family': 'Inter, sans-serif',
                  cursor: submitting() || !title().trim() ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  if (!submitting() && title().trim()) {
                    e.currentTarget.style.background = '#2563eb'
                  }
                }}
                onMouseLeave={e => {
                  if (!submitting() && title().trim()) {
                    e.currentTarget.style.background = '#3b82f6'
                  }
                }}
              >
                {submitting() ? 'Creating...' : 'Create Ticket'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Show>
  )
}

export default CreateTaskModal
