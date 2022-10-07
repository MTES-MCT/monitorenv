import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { Layers } from '../../domain/entities/layers'
import { showRegulatoryZoneMetadata } from '../../domain/use_cases/regulatory/showRegulatoryZoneMetadata'

import type { MapClickEvent } from '../../types'

export function ShowRegulatoryMetadata({ mapClickEvent }: { mapClickEvent: MapClickEvent }) {
  const dispatch = useDispatch()

  useEffect(() => {
    const { feature } = mapClickEvent
    if (feature) {
      const featureId = feature?.getId()?.toString()
      if (featureId?.includes(Layers.REGULATORY_ENV_PREVIEW.code) || featureId?.includes(Layers.REGULATORY_ENV.code)) {
        const layerId = feature.get('layerId')
        dispatch(showRegulatoryZoneMetadata(layerId))
      }
    }
  }, [dispatch, mapClickEvent])

  return null
}
