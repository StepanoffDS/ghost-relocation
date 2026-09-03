import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const root = createRoot(document.getElementById('root')!)

const start = async (): Promise<void> => {
  if (import.meta.env.VITE_USE_MOCKS === 'true') {
    const { worker } = await import('./shared/api/mocks/browser')
    await worker.start({ onUnhandledRequest: 'bypass' })
  }
  root.render(<App />)
}

void start().catch((cause: unknown) => {
  root.render(<p role="alert">Не удалось запустить mock API. Проверьте Service Worker и перезагрузите страницу.</p>)
  console.error('Mock API bootstrap failed', cause)
})
