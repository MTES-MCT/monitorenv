import { browserTracingIntegration } from '@sentry/browser'
import { init } from '@sentry/react'
import { isCypress } from '@utils/isCypress'
import { measureScrollbarWidth } from '@utils/styleHelpers'
import { getOIDCConfig } from 'auth/getOIDCConfig'
import { isEmpty } from 'lodash'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from 'react-oidc-context'

import { App } from './App'

import 'rsuite/dist/rsuite.min.css'
import 'ol/ol.css'
import './uiMonitor/ol-override.css'
import '@mtes-mct/monitor-ui/assets/stylesheets/rsuite-override.css'

if (import.meta.env.PROD && !isEmpty(import.meta.env.FRONTEND_SENTRY_DSN)) {
  init({
    dsn: import.meta.env.FRONTEND_SENTRY_DSN,
    environment: import.meta.env.FRONTEND_SENTRY_ENV,
    integrations: [browserTracingIntegration()],
    release: import.meta.env.FRONTEND_MONITORENV_VERSION,
    tracePropagationTargets: [import.meta.env.FRONTEND_SENTRY_TRACING_ORIGIN],
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

const { oidcConfig } = getOIDCConfig()

if (isCypress()) {
  root.render(
    // eslint-disable-next-line react/jsx-props-no-spreading
    <AuthProvider {...oidcConfig}>
      <App />
    </AuthProvider>
  )
} else {
  root.render(
    <StrictMode>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <AuthProvider {...oidcConfig}>
        <App />
      </AuthProvider>
    </StrictMode>
  )
}
