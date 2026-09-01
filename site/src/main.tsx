import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Same typeface as the product. Apple devices still get SF Pro first via
// -apple-system; Inter is the fallback everywhere else.
import '@fontsource-variable/inter'

// The app's own stylesheets, imported first and unmodified, because the site
// renders the real app. site.css then overrides the handful of globals that
// assume a fixed, non-scrolling shell.
import '../../src/styles/tokens.css'
import '../../src/styles/base.css'
import '../../src/styles/app.css'

import './styles/site.css'
import './styles/device.css'
import './styles/sections.css'

import Site from './App'

createRoot(document.getElementById('site')!).render(
  <StrictMode>
    <Site />
  </StrictMode>,
)
