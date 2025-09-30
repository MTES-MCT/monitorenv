import { Level } from '@mtes-mct/monitor-ui'

import type { EntityState } from '@reduxjs/toolkit'
import type { BannerStackItem, Environment } from 'types'

const environment = import.meta.env.FRONTEND_SENTRY_ENV as Environment
const version = import.meta.env.FRONTEND_MONITORENV_VERSION

export const envBannerProps = {
  children: `Vous êtes sur l'environnement ${
    environment === 'integration' ? "d'intégration" : 'de pré-production'
  } - Version : v${version}`,
  isClosable: false,
  isCollapsible: true,
  isFixed: true,
  level: Level.WARNING
}

export const shouldDisplayEnvBanner = (bannerStack: EntityState<BannerStackItem, number>) => {
  const isEnvBannerAlreadyDisplayed = Object.values(bannerStack.entities).some(
    banner => banner?.props.children === `Vous êtes sur l'environnement ${environment}.`
  )

  if (isEnvBannerAlreadyDisplayed) {
    return undefined
  }

  return envBannerProps
}
