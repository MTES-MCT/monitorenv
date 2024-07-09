import {
  getClickedAmpFeatures,
  getClickedItems,
  getClickedRegulatoryFeatures,
  getClickedVigilanceAreasFeatures
} from '@features/map/utils'
import {
  getIsLinkingAMPToVigilanceArea,
  getIsLinkingRegulatoryToVigilanceArea,
  vigilanceAreaActions
} from '@features/VigilanceArea/slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
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
  const editingVigilanceAreaId = useAppSelector(state => state.vigilanceArea.editingVigilanceAreaId)
  const isLinkingRegulatoryToVigilanceArea = useAppSelector(state => getIsLinkingRegulatoryToVigilanceArea(state))
  const isLinkingAmpToVigilanceArea = useAppSelector(state => getIsLinkingAMPToVigilanceArea(state))

  useEffect(() => {
    const clickedAmpFeatures = getClickedAmpFeatures(mapClickEvent)
    const clickedRegulatoryFeatures = getClickedRegulatoryFeatures(mapClickEvent)
    const clickedVigilanceAreaFeatures = getClickedVigilanceAreasFeatures(mapClickEvent)

    const numberOfClickedFeatures =
      (clickedAmpFeatures?.length ?? 0) +
      (clickedRegulatoryFeatures?.length ?? 0) +
      (clickedVigilanceAreaFeatures?.length ?? 0)

    if (numberOfClickedFeatures === 0) {
      dispatch(closeLayerOverlay())
    }

    if ((isLinkingRegulatoryToVigilanceArea || isLinkingAmpToVigilanceArea) && mapClickEvent.coordinates) {
      dispatch(closeMetadataPanel())
      dispatch(openLayerOverlay(mapClickEvent.coordinates))
      const items = getClickedItems(mapClickEvent)
      dispatch(setLayerOverlayItems(items))

      return
    }

    if (numberOfClickedFeatures === 1) {
      if (clickedAmpFeatures && clickedAmpFeatures.length === 1) {
        dispatch(closeLayerOverlay())
        const feature = convertToFeature(clickedAmpFeatures[0])
        if (feature) {
          const layerId = feature.get('id')
          dispatch(openAMPMetadataPanel(layerId))
          if (editingVigilanceAreaId) {
            dispatch(vigilanceAreaActions.setSelectedVigilanceAreaId(editingVigilanceAreaId))
          }
        }

        return
      }

      if (clickedRegulatoryFeatures && clickedRegulatoryFeatures.length === 1) {
        const feature = convertToFeature(clickedRegulatoryFeatures[0])
        if (feature) {
          const layerId = feature.get('id')
          dispatch(openRegulatoryMetadataPanel(layerId))
          if (editingVigilanceAreaId) {
            dispatch(vigilanceAreaActions.setSelectedVigilanceAreaId(editingVigilanceAreaId))
          }
        }

        return
      }

      if (clickedVigilanceAreaFeatures && clickedVigilanceAreaFeatures.length === 1) {
        dispatch(closeLayerOverlay())
        const feature = convertToFeature(clickedVigilanceAreaFeatures[0])
        if (feature) {
          const layerId = feature.get('id')
          dispatch(closeMetadataPanel())

          dispatch(vigilanceAreaActions.setSelectedVigilanceAreaId(layerId))
        }
      }

      return
    }

    if (numberOfClickedFeatures > 1 && mapClickEvent.coordinates) {
      dispatch(closeMetadataPanel())
      dispatch(openLayerOverlay(mapClickEvent.coordinates))
      const items = getClickedItems(mapClickEvent)
      dispatch(setLayerOverlayItems(items))

      if (editingVigilanceAreaId) {
        dispatch(vigilanceAreaActions.setSelectedVigilanceAreaId(editingVigilanceAreaId))
      }
    }

    // we don't want to listen editingVigilanceAreaId changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, mapClickEvent])

  return null
}
