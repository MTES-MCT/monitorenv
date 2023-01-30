import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { Layers } from '../../domain/entities/layers/constants'
import { showRegulatoryZoneMetadata } from '../../domain/use_cases/regulatory/showRegulatoryZoneMetadata'

import type { MapChildrenProps } from './Map'

export function ShowRegulatoryMetadata({ mapClickEvent }: MapChildrenProps) {
  const dispatch = useDispatch()

  useEffect(() => {
    if (mapClickEvent?.feature) {
      const { feature } = mapClickEvent
      const featureId = feature?.getId()?.toString()
      if (featureId?.includes(Layers.REGULATORY_ENV_PREVIEW.code) || featureId?.includes(Layers.REGULATORY_ENV.code)) {
        const layerId = feature.get('layerId')
        dispatch(showRegulatoryZoneMetadata(layerId))
      }
    }
  }, [dispatch, mapClickEvent])

  return null
}
