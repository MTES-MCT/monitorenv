import { Dashboard } from '@features/Dashboard/types'
import { getClickedFeatures, getClickedItems } from '@features/map/utils'
import { recentActivityActions } from '@features/RecentActivity/slice'
import { getIsLinkingZonesToVigilanceArea, vigilanceAreaActions } from '@features/VigilanceArea/slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Layers } from 'domain/entities/layers/constants'
import { getOverlayCoordinates } from 'domain/shared_slices/Global'
import { layerSidebarActions } from 'domain/shared_slices/LayerSidebar'
import { mapActions } from 'domain/shared_slices/Map'
import { convertToFeature } from 'domain/types/map'
import { closeAreaOverlay } from 'domain/use_cases/map/closeAreaOverlay'
import { Feature } from 'ol'
import { Point } from 'ol/geom'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { useEffect, useRef } from 'react'

import { FEATURE_ID } from '.'
import { layerListIconStyle } from './style'
import {
  closeMetadataPanel,
  openAMPMetadataPanel,
  openLayerOverlay,
  openRegulatoryMetadataPanel,
  setLayerOverlayItems
} from '../metadataPanel/slice'

import type { BaseMapChildrenProps } from '@features/map/BaseMap'

export function LayerEvents({ map, mapClickEvent }: BaseMapChildrenProps) {
  const dispatch = useAppDispatch()
  const editingVigilanceAreaId = useAppSelector(state => state.vigilanceArea.editingVigilanceAreaId)
  const isLinkingZonesToVigilanceArea = useAppSelector(state => getIsLinkingZonesToVigilanceArea(state))

  const isAreaSelected = useAppSelector(state => state.map.isAreaSelected)

  const vectorSource = useRef(new VectorSource({}))
  const vectorLayer = useRef(
    new VectorLayer({
      source: vectorSource.current,
      style: (_, resolution) => layerListIconStyle(resolution),
      zIndex: Layers.AREA_ICON.zIndex
    })
  )
  const feature = vectorSource.current?.getFeatureById(`${Layers.AREA_ICON}:${FEATURE_ID}`)
  const overlayCoordinates = useAppSelector(state => getOverlayCoordinates(state.global, String(feature?.getId())))

  useEffect(() => {
    if (!isAreaSelected) {
      if (feature) {
        vectorSource.current?.removeFeature(feature)
      }

      return
    }

    const iconFeature = new Feature({
      geometry: new Point(mapClickEvent.coordinates ?? [0, 0])
    })
    iconFeature.setId(`${Layers.AREA_ICON}:${FEATURE_ID}`)

    vectorSource.current?.addFeature(iconFeature)

    // we just want to listen isAreaSelected changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAreaSelected])

  useEffect(() => {
    feature?.setProperties({ overlayCoordinates })
  }, [feature, overlayCoordinates])

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
    const clickedAmpFeatures = getClickedFeatures({
      isRegulatoryOrAmp: true,
      mapClickEvent,
      typesList: [
        Layers.AMP_PREVIEW.code,
        Layers.AMP.code,
        Layers.AMP_LINKED_TO_VIGILANCE_AREA.code,
        Dashboard.Layer.DASHBOARD_AMP
      ]
    })
    const clickedRegulatoryFeatures = getClickedFeatures({
      isRegulatoryOrAmp: true,
      mapClickEvent,
      typesList: [
        Layers.REGULATORY_ENV_PREVIEW.code,
        Layers.REGULATORY_ENV.code,
        Layers.REGULATORY_AREAS_LINKED_TO_VIGILANCE_AREA.code,
        Dashboard.Layer.DASHBOARD_REGULATORY_AREAS
      ]
    })
    const clickedVigilanceAreaFeatures = getClickedFeatures({
      isRegulatoryOrAmp: false,
      mapClickEvent,
      typesList: [
        Layers.VIGILANCE_AREA.code,
        Layers.VIGILANCE_AREA_PREVIEW.code,
        Dashboard.Layer.DASHBOARD_VIGILANCE_AREAS
      ]
    })

    const numberOfClickedFeatures =
      (clickedAmpFeatures?.length ?? 0) +
      (clickedRegulatoryFeatures?.length ?? 0) +
      (clickedVigilanceAreaFeatures?.length ?? 0)

    if (numberOfClickedFeatures === 0) {
      dispatch(closeAreaOverlay())
    }

    if (isLinkingZonesToVigilanceArea && mapClickEvent.coordinates) {
      dispatch(closeMetadataPanel())
      dispatch(openLayerOverlay(mapClickEvent.coordinates))
      const items = getClickedItems(mapClickEvent, isLinkingZonesToVigilanceArea)
      dispatch(setLayerOverlayItems(items))

      return
    }

    if (numberOfClickedFeatures === 1) {
      dispatch(mapActions.setIsolateMode(undefined))
      if (clickedAmpFeatures && clickedAmpFeatures.length === 1) {
        dispatch(closeAreaOverlay())
        const currentFeature = convertToFeature(clickedAmpFeatures[0])
        if (currentFeature) {
          const layerId = currentFeature.get('id')
          dispatch(openAMPMetadataPanel(layerId))
          dispatch(layerSidebarActions.toggleAmpResults(true))

          if (editingVigilanceAreaId) {
            dispatch(vigilanceAreaActions.setSelectedVigilanceAreaId(editingVigilanceAreaId))
          }
        }

        return
      }

      if (clickedRegulatoryFeatures && clickedRegulatoryFeatures.length === 1) {
        dispatch(closeAreaOverlay())
        const currentFeature = convertToFeature(clickedRegulatoryFeatures[0])
        if (currentFeature) {
          const layerId = currentFeature.get('id')
          dispatch(openRegulatoryMetadataPanel(layerId))
          dispatch(layerSidebarActions.toggleRegulatoryResults(true))

          if (editingVigilanceAreaId) {
            dispatch(vigilanceAreaActions.setSelectedVigilanceAreaId(editingVigilanceAreaId))
          }
        }

        return
      }

      if (clickedVigilanceAreaFeatures && clickedVigilanceAreaFeatures.length === 1) {
        dispatch(closeAreaOverlay())
        const currentFeature = convertToFeature(clickedVigilanceAreaFeatures[0])
        if (currentFeature) {
          const layerId = currentFeature.get('id')
          dispatch(closeMetadataPanel())
          dispatch(layerSidebarActions.toggleVigilanceAreaResults(true))

          if (layerId) {
            dispatch(vigilanceAreaActions.setSelectedVigilanceAreaId(+layerId))
          }
        }
      }

      return
    }

    if (numberOfClickedFeatures > 1 && mapClickEvent.coordinates) {
      // close recent controls activity list
      dispatch(recentActivityActions.resetControlListOverlay())

      dispatch(closeMetadataPanel())
      dispatch(openLayerOverlay(mapClickEvent.coordinates))

      const items = getClickedItems(mapClickEvent, isLinkingZonesToVigilanceArea)
      dispatch(setLayerOverlayItems(items))

      if (editingVigilanceAreaId) {
        dispatch(vigilanceAreaActions.setSelectedVigilanceAreaId(editingVigilanceAreaId))
      }

      dispatch(mapActions.setIsAreaSelected(true))
    }

    // we don't want to listen editingVigilanceAreaId changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, mapClickEvent])

  return null
}
