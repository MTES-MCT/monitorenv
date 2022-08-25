import React from 'react'
import ReactDOM from 'react-dom'
import 'rsuite/dist/rsuite.min.css'
import 'ol/ol.css'

import './index.css'
import './App.css'
import './uiMonitor/ol-override.css'
import './uiMonitor/rsuite-override.css'

import * as Sentry from '@sentry/react'
import { Integrations } from '@sentry/tracing'

import App from './App'
import GlobalFonts from './fonts/fonts'

if (process.env.NODE_ENV !== 'development') {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    integrations: [new Integrations.BrowserTracing({
      tracingOrigins: process.env.REACT_APP_SENTRY_TRACING_ORIGINS
    })],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0
  })
}

ReactDOM.render(
  <React.StrictMode>
    <GlobalFonts />
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
