import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { initScroll, prefersReducedMotion } from './lib/scroll'
import './styles/tokens.css'
import './styles/base.css'
import './styles/app.css'

/* spec 5.5: reduced motion is a first-class output, not a fallback. The flag is
   set on <html> before first paint so every stage renders its poster state. */
if (prefersReducedMotion()) {
  document.documentElement.dataset.motion = 'reduced'
}

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

initScroll()
