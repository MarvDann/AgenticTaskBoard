import { Component } from 'solid-js'
import CostHeader from './components/CostHeader'
import TaskBoard from './components/TaskBoard'
import './styles/theme.css'

const App: Component = () => {
  return (
    <div
      class="container"
      style={{
        'min-height': '100vh',
        padding: '1rem',
        background: 'var(--bg-primary)',
      }}
    >
      <CostHeader />
      <TaskBoard />
    </div>
  )
}

export default App
