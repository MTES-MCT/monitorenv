import * as Sentry from '@sentry/react'
import { Integrations } from '@sentry/tracing'
import { createRoot } from 'react-dom/client'

import { App } from './App'
import { GlobalStyle } from './fonts/fonts'

import 'rsuite/dist/rsuite.min.css'
import 'ol/ol.css'
import 'react-toastify/dist/ReactToastify.css'
import './index.css'
import './App.css'
import './uiMonitor/ol-override.css'
import './uiMonitor/rsuite-override.css'

const { NODE_ENV, REACT_APP_SENTRY_DSN, REACT_APP_SENTRY_TRACING_ORIGINS } = process.env

if (NODE_ENV === 'production') {
  Sentry.init({
    dsn: REACT_APP_SENTRY_DSN || '',
    integrations: [
      new Integrations.BrowserTracing({
        tracingOrigins: REACT_APP_SENTRY_TRACING_ORIGINS ? [REACT_APP_SENTRY_TRACING_ORIGINS] : undefined
      })
    ],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0
  })
}

const container = document.getElementById('root')
if (!container) {
  throw new Error('Cannot find container element with id #root.')
}
const root = createRoot(container)

root.render(
  <>
    <GlobalStyle />
    <App />
  </>
)
