import * as Sentry from '@sentry/react'
import { Integrations } from '@sentry/tracing'
import { createRoot } from 'react-dom/client'

import { App } from './App'
import { SENTRY_DSN, SENTRY_ENV, SENTRY_TRACING_ORIGINS, MONITORENV_VERSION } from './env'

import 'rsuite/dist/rsuite.min.css'
import 'ol/ol.css'
import 'react-toastify/dist/ReactToastify.css'
import './index.css'
import './App.css'
import './uiMonitor/ol-override.css'
import './uiMonitor/rsuite-override.css'

if (!(process.env.NODE_ENV === 'development')) {
  Sentry.init({
    dsn: SENTRY_DSN || '',
    environment: SENTRY_ENV,
    integrations: [
      new Integrations.BrowserTracing({
        tracingOrigins: SENTRY_TRACING_ORIGINS ? [SENTRY_TRACING_ORIGINS] : undefined
      })
    ],
    release: `monitorenv:${MONITORENV_VERSION}`,

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

root.render(<App />)
