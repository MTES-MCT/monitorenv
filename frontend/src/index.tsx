import { BrowserTracing } from '@sentry/browser'
import { init } from '@sentry/react'
import { measureScrollbarWidth } from '@utils/styleHelpers'
import { isEmpty } from 'lodash'
import { createRoot } from 'react-dom/client'

import { App } from './App'

import 'rsuite/dist/rsuite.min.css'
import 'ol/ol.css'
import 'react-toastify/dist/ReactToastify.css'
import './index.css'
import './App.css'
import './uiMonitor/ol-override.css'
import './uiMonitor/rsuite-override.css'

if (import.meta.env.PROD && !isEmpty(import.meta.env.FRONTEND_SENTRY_DSN)) {
  init({
    dsn: import.meta.env.FRONTEND_SENTRY_DSN,
    environment: import.meta.env.FRONTEND_SENTRY_ENV,
    integrations: [
      new BrowserTracing({
        tracingOrigins: [import.meta.env.FRONTEND_SENTRY_TRACING_ORIGIN]
      })
    ],
    release: import.meta.env.FRONTEND_MONITORENV_VERSION,

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0
  })
}

measureScrollbarWidth()

const container = document.getElementById('root')
if (!container) {
  throw new Error('Cannot find container element with id #root.')
}
const root = createRoot(container)

root.render(<App />)
