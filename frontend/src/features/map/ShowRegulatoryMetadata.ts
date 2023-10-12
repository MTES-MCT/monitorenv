import { useEffect } from 'react'

import { Layers } from '../../domain/entities/layers/constants'
import { showRegulatoryZoneMetadata } from '../../domain/use_cases/regulatory/showRegulatoryZoneMetadata'
import { useAppDispatch } from '../../hooks/useAppDispatch'

import type { BaseMapChildrenProps } from './BaseMap'

export function ShowRegulatoryMetadata({ mapClickEvent }: BaseMapChildrenProps) {
  const dispatch = useAppDispatch()

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
