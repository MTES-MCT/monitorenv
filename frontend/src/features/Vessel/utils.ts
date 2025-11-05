import type { Vessel } from './types'

export const isVesselsEnabled = () => import.meta.env.FRONTEND_VESSELS_ENABLED === 'true'

export const toOptions = (vessels: Vessel.Identity[] | undefined) =>
  (vessels ?? []).map(value => {
    const label = value.shipName ?? 'NOM INCONNU'

    return {
      label,
      value
    }
  })
