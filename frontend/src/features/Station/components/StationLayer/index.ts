import { convertToFeature } from 'domain/types/map'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { useEffect, useMemo, useRef } from 'react'

import { getStationPointFeature, getFeatureStyle } from './utils'
import { useGetStationsQuery } from '../../../../api/stationsAPI'
import { Layers } from '../../../../domain/entities/layers/constants'
import { removeOverlayCoordinatesByName } from '../../../../domain/shared_slices/Global'
import { useAppDispatch } from '../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { useHasMapInteraction } from '../../../../hooks/useHasMapInteraction'
import { FrontendError } from '../../../../libs/FrontendError'
import { stationActions } from '../../slice'

import type { VectorLayerWithName } from '../../../../domain/types/layer'
import type { BaseMapChildrenProps } from '../../../map/BaseMap'

export function StationLayer({ map, mapClickEvent }: BaseMapChildrenProps) {
  const vectorSourceRef = useRef(new VectorSource())
  const vectorLayerRef = useRef(
    new VectorLayer({
      renderBuffer: 7,
      source: vectorSourceRef.current,
      style: getFeatureStyle,
      updateWhileAnimating: true,
      updateWhileInteracting: true,
      zIndex: Layers.STATIONS.zIndex
    })
  )
  ;(vectorLayerRef.current as VectorLayerWithName).name = Layers.STATIONS.code

  const dispatch = useAppDispatch()
  const displayStationLayer = useAppSelector(state => state.global.displayStationLayer)
  const overlayCoordinates = useAppSelector(state => state.global.overlayCoordinates)
  const highlightedFeatureIds = useAppSelector(state => state.station.highlightedFeatureIds)
  const selectedFeatureId = useAppSelector(state => state.station.selectedFeatureId)

  // we don't want to display stations on the map if the user so decides (displayStationLayer variable)
  // or if user have interaction on map (edit mission zone, attach reporting or mission)
  const hasMapInteraction = useHasMapInteraction()
  const isLayerVisible = useMemo(
    () => displayStationLayer && !hasMapInteraction,
    [displayStationLayer, hasMapInteraction]
  )

  const { data: stations } = useGetStationsQuery()

  const stationsAsFeatures = useMemo(
    () => (stations ?? []).filter(station => station.controlUnitResourceIds.length > 0).map(getStationPointFeature),
    [stations]
  )

  // ---------------------------------------------------------------------------
  // Features Events

  useEffect(() => {
    const feature = convertToFeature(mapClickEvent?.feature)
    if (!feature) {
      return
    }

    const featureId = feature?.getId()?.toString()
    if (!featureId?.startsWith(Layers.STATIONS.code)) {
      return
    }

    dispatch(stationActions.selectFeatureId(featureId))
    dispatch(stationActions.hightlightFeatureIds([featureId]))
    dispatch(removeOverlayCoordinatesByName(Layers.STATIONS.code))
  }, [dispatch, mapClickEvent])

  // ---------------------------------------------------------------------------
  // Features Hightlight & Selection

  useEffect(() => {
    if (!vectorSourceRef.current) {
      return
    }

    vectorSourceRef.current.forEachFeature(feature => {
      const featureId = feature.getId()
      if (typeof featureId !== 'string') {
        throw new FrontendError('`featureId` is undefined.')
      }

      feature.setProperties({
        isHighlighted: highlightedFeatureIds.includes(featureId),
        isSelected: featureId === selectedFeatureId,
        overlayCoordinates: featureId === selectedFeatureId ? overlayCoordinates[Layers.STATIONS.code] : undefined
      })
    })
  }, [highlightedFeatureIds, overlayCoordinates, selectedFeatureId])

  // ---------------------------------------------------------------------------
  // Features Visibility

  useEffect(() => {
    vectorLayerRef.current?.setVisible(isLayerVisible)
  }, [isLayerVisible])

  useEffect(() => {
    vectorSourceRef.current.clear(true)
    vectorSourceRef.current.addFeatures(stationsAsFeatures)
  }, [stationsAsFeatures])

  // ---------------------------------------------------------------------------
  // Layer Attachment

  useEffect(
    () => {
      map.getLayers().push(vectorLayerRef.current)

      return () => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        map.removeLayer(vectorLayerRef.current)
      }
    },

    // We include `stations` to update the layers when their control unit resources change
    [map, stations]
  )

  return null
}
