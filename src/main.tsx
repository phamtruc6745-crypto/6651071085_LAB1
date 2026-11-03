import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'
import { LanguageProvider } from './context/LanguageProvider'
import { TasksProvider } from './context/TasksProvider'
import './index.css'

const container = document.getElementById('root')
if (container === null) {
  throw new Error('Root element #root not found')
}

createRoot(container).render(
  <StrictMode>
    <HashRouter>
      <LanguageProvider>
        <TasksProvider>
          <App />
        </TasksProvider>
      </LanguageProvider>
    </HashRouter>
  </StrictMode>,
)
