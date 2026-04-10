import type { Environment } from 'types'

const environment = import.meta.env.FRONTEND_SENTRY_ENV as Environment
const version = import.meta.env.FRONTEND_MONITORENV_VERSION
const environmentMessage = `ENVIRONNEMENT ${environment === 'integration' ? "D'INTEGRATION" : 'DE PRE-PRODUCTION'}`
const isEnvironmentBoxVisible = environment === 'integration' || environment === 'preprod'

export function getEnvironmentData() {
  return {
    environmentMessage,
    isEnvironmentBoxVisible,
    version
  }
}
