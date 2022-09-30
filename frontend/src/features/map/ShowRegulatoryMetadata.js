import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { Layers } from '../../domain/entities/layers'
import { showRegulatoryZoneMetadata } from '../../domain/use_cases/regulatory/showRegulatoryZoneMetadata'

export function ShowRegulatoryMetadata({ mapClickEvent }) {
  const dispatch = useDispatch()

  useEffect(() => {
    if (mapClickEvent?.feature) {
      const feature = mapClickEvent?.feature
      console.log('mapClickEvent', feature)
      if (feature.getId()?.toString()?.includes(Layers.REGULATORY_PREVIEW.code)) {
        const props = feature.get('layerId')
        dispatch(showRegulatoryZoneMetadata(props))
      }
    }
  }, [dispatch, mapClickEvent])

  return null
}
