import { Component } from 'solid-js'
import CostHeader from './components/CostHeader'
import TaskBoard from './components/TaskBoard'
import './styles/theme.css'

const App: Component = () => {
  return (
    <div
      class="container"
      style={{
        height: '100vh',
        display: 'flex',
        'flex-direction': 'column',
        overflow: 'hidden',
        background: 'var(--bg-primary)',
        'font-family': 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <CostHeader />
      <TaskBoard />
    </div>
  )
}

export default App
