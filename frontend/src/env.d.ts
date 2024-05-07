// https://vitejs.dev/guide/env-and-mode#intellisense-for-typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly FRONTEND_GEOSERVER_NAMESPACE: string
  readonly FRONTEND_GEOSERVER_REMOTE_URL: string
  readonly FRONTEND_GOOGLEMAPS_API_KEY: string
  readonly FRONTEND_MAPBOX_KEY: string
  readonly FRONTEND_MISSION_FORM_AUTO_SAVE_ENABLED: string
  readonly FRONTEND_MISSION_FORM_AUTO_UPDATE: string
  readonly FRONTEND_MONITORENV_VERSION: string
  readonly FRONTEND_REPORTING_FORM_AUTO_SAVE_ENABLED: string
  readonly FRONTEND_SENTRY_DSN: string
  readonly FRONTEND_SENTRY_ENV: string
  readonly FRONTEND_SENTRY_TRACING_ORIGIN: string
  readonly FRONTEND_SHOM_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
