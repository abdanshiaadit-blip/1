import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Self-hosted so typography is identical on every machine. Apple devices still
// get SF Pro first via -apple-system; Inter is the fallback everywhere else.
import '@fontsource-variable/inter'
import './styles/tokens.css'
import './styles/base.css'
import './styles/app.css'
import App from './App'

// Not top-level await: the portable build bundles to a classic script, which
// cannot use it. This branch is dead-code eliminated in production anyway.
if (import.meta.env.DEV) {
  void (async () => {
    const { profiles } = await import('./data')
    const { validateProfiles } = await import('./data/validate')
    validateProfiles(profiles)
  })()
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
