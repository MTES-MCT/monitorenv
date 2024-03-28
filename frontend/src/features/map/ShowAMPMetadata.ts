import { useEffect } from 'react'

import { Layers } from '../../domain/entities/layers/constants'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { openAMPMetadataPanel } from '../layersSelector/metadataPanel/slice'

import type { BaseMapChildrenProps } from './BaseMap'

export function ShowAMPMetadata({ mapClickEvent }: BaseMapChildrenProps) {
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (mapClickEvent?.feature) {
      const { feature } = mapClickEvent
      const featureId = feature?.getId()?.toString()
      if (featureId?.includes(Layers.AMP_PREVIEW.code) || featureId?.includes(Layers.AMP.code)) {
        const layerId = feature.get('id')
        dispatch(openAMPMetadataPanel(layerId))
      }
    }
  }, [dispatch, mapClickEvent])

  return null
}
