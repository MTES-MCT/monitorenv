import { getClickedAmpFeatures, getClickedItems, getClickedRegulatoryFeatures } from '@features/map/utils'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { convertToFeature } from 'domain/types/map'
import { useEffect } from 'react'

import {
  closeLayerOverlay,
  closeMetadataPanel,
  openAMPMetadataPanel,
  openLayerOverlay,
  openRegulatoryMetadataPanel,
  setLayerOverlayItems
} from '../metadataPanel/slice'

import type { BaseMapChildrenProps } from '@features/map/BaseMap'

export function LayerEvents({ mapClickEvent }: BaseMapChildrenProps) {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const clickedAmpFeatures = getClickedAmpFeatures(mapClickEvent)
    const clickedRegulatoryFeatures = getClickedRegulatoryFeatures(mapClickEvent)
    const numberOfClickedFeatures = (clickedAmpFeatures?.length ?? 0) + (clickedRegulatoryFeatures?.length ?? 0)
    if (numberOfClickedFeatures === 0) {
      dispatch(closeLayerOverlay())
    }

    if (numberOfClickedFeatures === 1 && clickedAmpFeatures && clickedAmpFeatures.length === 1) {
      dispatch(closeLayerOverlay())
      const feature = convertToFeature(clickedAmpFeatures[0])
      if (feature) {
        const layerId = feature.get('id')
        dispatch(openAMPMetadataPanel(layerId))
      }
    }

    if (numberOfClickedFeatures === 1 && clickedRegulatoryFeatures && clickedRegulatoryFeatures.length === 1) {
      const feature = convertToFeature(clickedRegulatoryFeatures[0])
      if (feature) {
        const layerId = feature.get('id')
        dispatch(openRegulatoryMetadataPanel(layerId))
      }
    }

    if (numberOfClickedFeatures > 1 && mapClickEvent.coordinates) {
      dispatch(closeMetadataPanel())
      dispatch(openLayerOverlay(mapClickEvent.coordinates))
      const items = getClickedItems(mapClickEvent)
      dispatch(setLayerOverlayItems(items))
    }
  }, [dispatch, mapClickEvent])

  return null
}
