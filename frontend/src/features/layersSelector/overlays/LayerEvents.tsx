import {
  getClickedAmpFeatures,
  getClickedItems,
  getClickedRegulatoryFeatures,
  getClickedVigilanceAreasFeatures
} from '@features/map/utils'
import { getIsLinkingZonesToVigilanceArea, vigilanceAreaActions } from '@features/VigilanceArea/slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Layers } from 'domain/entities/layers/constants'
import { mapActions } from 'domain/shared_slices/Map'
import { convertToFeature } from 'domain/types/map'
import { Feature } from 'ol'
import { Point } from 'ol/geom'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { useEffect, useRef } from 'react'

import { layerListIconStyle } from './style'
import {
  closeLayerOverlay,
  closeMetadataPanel,
  openAMPMetadataPanel,
  openLayerOverlay,
  openRegulatoryMetadataPanel,
  setLayerOverlayItems
} from '../metadataPanel/slice'

import type { BaseMapChildrenProps } from '@features/map/BaseMap'

const FEATURE_ID = 'LayerListIconFeature'

export function LayerEvents({ map, mapClickEvent }: BaseMapChildrenProps) {
  const dispatch = useAppDispatch()
  const editingVigilanceAreaId = useAppSelector(state => state.vigilanceArea.editingVigilanceAreaId)
  const isLinkingZonesToVigilanceArea = useAppSelector(state => getIsLinkingZonesToVigilanceArea(state))
  const overlayCoordinates = useAppSelector(state => state.global.overlayCoordinates)
  const isLayerListSelected = useAppSelector(state => state.map.isLayerListSelected)

  const vectorSource = useRef(new VectorSource({}))
  const vectorLayer = useRef(
    new VectorLayer({
      source: vectorSource.current,
      style: (feature, resolution) => layerListIconStyle(feature, resolution)
    })
  )

  useEffect(() => {
    if (!isLayerListSelected) {
      const feature = vectorSource.current?.getFeatureById(`${Layers.LAYER_LIST_ICON}:${FEATURE_ID}`)

      if (feature) {
        vectorSource.current?.removeFeature(feature)
      }

      return
    }

    const iconFeature = new Feature({
      geometry: new Point(mapClickEvent.coordinates ?? [0, 0])
    })
    iconFeature.setId(`${Layers.LAYER_LIST_ICON}:${FEATURE_ID}`)

    vectorSource.current?.addFeature(iconFeature)

    // we just want to listen isLayerListSelected changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLayerListSelected])

  useEffect(() => {
    const feature = vectorSource.current?.getFeatureById(`${Layers.LAYER_LIST_ICON}:${FEATURE_ID}`)
    feature?.setProperties({
      overlayCoordinates: overlayCoordinates[Layers.LAYER_LIST_ICON.code]
    })
  }, [overlayCoordinates])

  useEffect(() => {
    if (map) {
      const layersCollection = map.getLayers()
      layersCollection.push(vectorLayer.current)
    }

    return () => {
      if (map) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        map.removeLayer(vectorLayer.current)
      }
    }
  }, [map, vectorLayer])

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

    if (isLinkingZonesToVigilanceArea && mapClickEvent.coordinates) {
      dispatch(closeMetadataPanel())
      dispatch(openLayerOverlay(mapClickEvent.coordinates))
      const items = getClickedItems(mapClickEvent, isLinkingZonesToVigilanceArea)
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
          if (layerId) {
            dispatch(vigilanceAreaActions.setSelectedVigilanceAreaId(layerId))
          }
        }
      }

      return
    }

    if (numberOfClickedFeatures > 1 && mapClickEvent.coordinates) {
      dispatch(closeMetadataPanel())
      dispatch(openLayerOverlay(mapClickEvent.coordinates))
      const items = getClickedItems(mapClickEvent, isLinkingZonesToVigilanceArea)
      dispatch(setLayerOverlayItems(items))

      if (editingVigilanceAreaId) {
        dispatch(vigilanceAreaActions.setSelectedVigilanceAreaId(editingVigilanceAreaId))
      }

      dispatch(mapActions.setIsLayerListSelected(true))
    }

    // we don't want to listen editingVigilanceAreaId changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, mapClickEvent])

  return null
}
