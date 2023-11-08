import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { useEffect, useMemo, useRef } from 'react'

import { getStationPointFeature, getFeatureStyle } from './utils'
import { useGetStationsQuery } from '../../../../api/stationsAPI'
import { Layers } from '../../../../domain/entities/layers/constants'
import { setOverlayCoordinates } from '../../../../domain/shared_slices/Global'
import { useAppDispatch } from '../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { FrontendError } from '../../../../libs/FrontendError'
import { controlUnitListDialogActions } from '../../../ControlUnit/components/ControlUnitListDialog/slice'
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
  const global = useAppSelector(state => state.global)
  const station = useAppSelector(state => state.station)
  const listener = useAppSelector(state => state.draw.listener)

  const { data: stations } = useGetStationsQuery()

  const stationsAsFeatures = useMemo(() => (stations || []).map(getStationPointFeature), [stations])

  // ---------------------------------------------------------------------------
  // Features Events

  useEffect(() => {
    const feature = mapClickEvent?.feature
    if (!feature) {
      return
    }

    const featureId = mapClickEvent?.feature?.getId()?.toString()
    if (!featureId?.startsWith(Layers.STATIONS.code)) {
      return
    }

    const featureProps = feature.getProperties()

    dispatch(stationActions.selectFeatureId(featureId))
    dispatch(stationActions.hightlightFeatureIds([featureId]))
    dispatch(setOverlayCoordinates(undefined))
    dispatch(
      controlUnitListDialogActions.setFilter({
        key: 'stationId',
        value: featureProps.station.id
      })
    )
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
        isHighlighted: station.highlightedFeatureIds.includes(featureId),
        isSelected: featureId === station.selectedFeatureId,
        overlayCoordinates: featureId === station.selectedFeatureId ? global.overlayCoordinates : undefined
      })
    })
  }, [station.highlightedFeatureIds, station.selectedFeatureId, global.overlayCoordinates])

  // ---------------------------------------------------------------------------
  // Features Visibility

  useEffect(() => {
    vectorLayerRef.current?.setVisible(global.displayStationLayer && !listener)
  }, [global.displayStationLayer, listener])

  useEffect(() => {
    vectorSourceRef.current.clear(true)
    vectorSourceRef.current.addFeatures(stationsAsFeatures)
  }, [stationsAsFeatures])

  // ---------------------------------------------------------------------------
  // Layer Attachment

  useEffect(() => {
    map.getLayers().push(vectorLayerRef.current)

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      map.removeLayer(vectorLayerRef.current)
    }
  }, [map])

  return null
}
