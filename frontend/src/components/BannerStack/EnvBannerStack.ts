import { Level } from '@mtes-mct/monitor-ui'

import type { Environment } from '../../types'

const environment = import.meta.env.FRONTEND_SENTRY_ENV as Environment
const version = import.meta.env.FRONTEND_MONITORENV_VERSION

export namespace EnvBannerStack {
  const message = `Vous êtes sur l'environnement ${
    environment === 'integration' ? "d'intégration" : 'de pré-production'
  } - Version : ${version}`

  export const Props = {
    children: message,
    isClosable: false,
    isCollapsible: true,
    isFixed: true,
    level: Level.WARNING
  }
}
