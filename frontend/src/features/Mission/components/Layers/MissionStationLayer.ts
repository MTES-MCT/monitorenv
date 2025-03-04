import { useGetStationsQuery } from '@api/stationsAPI'
import { getFeatureStyle, getStationPointFeature } from '@features/Station/components/StationLayer/utils'
import { stationActions } from '@features/Station/slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { useHasMapInteraction } from '@hooks/useHasMapInteraction'
import { Layers } from 'domain/entities/layers/constants'
import { removeOverlayStroke } from 'domain/shared_slices/Global'
import { convertToFeature } from 'domain/types/map'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { useEffect, useMemo, useRef, type MutableRefObject } from 'react'

import type { BaseMapChildrenProps } from '@features/map/BaseMap'
import type { VectorLayerWithName } from 'domain/types/layer'

export function MissionStationLayer({ map, mapClickEvent }: BaseMapChildrenProps) {
  const missionStationVectorSourceRef = useRef(new VectorSource())
  const missionStationVectorLayerRef = useRef(
    new VectorLayer({
      renderBuffer: 7,
      source: missionStationVectorSourceRef.current,
      style: getFeatureStyle,
      zIndex: Layers.MISSION_STATION.zIndex
    })
  ) as MutableRefObject<VectorLayerWithName>
  missionStationVectorLayerRef.current.name = Layers.MISSION_STATION.code

  const dispatch = useAppDispatch()
  const overlayCoordinates = useAppSelector(state => state.global.overlayCoordinates)
  const selectedFeatureId = useAppSelector(state => state.station.selectedFeatureId)

  const missionCenteredControlUnitId = useAppSelector(state => state.missionForms.missionCenteredControlUnitId)

  const hasMapInteraction = useHasMapInteraction()
  const isLayerVisible = useMemo(
    () => !!missionCenteredControlUnitId && !hasMapInteraction,
    [hasMapInteraction, missionCenteredControlUnitId]
  )

  const { data: stations } = useGetStationsQuery()

  const stationsAsFeatures = useMemo(
    () =>
      (stations ?? [])
        .filter(station =>
          station.controlUnitResources.some(
            controlUnitResource => controlUnitResource.controlUnitId === missionCenteredControlUnitId
          )
        )
        .map(station => {
          const filteredControlUnitResources = station.controlUnitResources.filter(
            controlUnitResource => controlUnitResource.controlUnitId === missionCenteredControlUnitId
          )

          return getStationPointFeature(
            {
              ...station,
              controlUnitResourceIds: filteredControlUnitResources.map(({ id }) => id),
              controlUnitResources: filteredControlUnitResources
            },
            Layers.MISSION_STATION.code,
            true
          )
        }),
    [stations, missionCenteredControlUnitId]
  )

  useEffect(() => {
    const feature = convertToFeature(mapClickEvent?.feature)
    if (!feature) {
      return
    }

    const featureId = feature?.getId()?.toString()
    if (!featureId?.startsWith(Layers.MISSION_STATION.code)) {
      return
    }

    dispatch(stationActions.selectFeatureId(featureId))
    dispatch(removeOverlayStroke())
  }, [dispatch, mapClickEvent])

  useEffect(() => {
    if (!missionStationVectorSourceRef.current) {
      return
    }

    missionStationVectorSourceRef.current.forEachFeature(feature => {
      const featureId = feature.getId()
      const overlayCoordinate = overlayCoordinates.find(({ name }) => name === selectedFeatureId)
      feature.setProperties({
        isSelected: featureId === selectedFeatureId,
        overlayCoordinates: featureId === selectedFeatureId ? overlayCoordinate : undefined
      })
    })
  }, [overlayCoordinates, selectedFeatureId])

  useEffect(() => {
    missionStationVectorLayerRef.current?.setVisible(isLayerVisible)
  }, [isLayerVisible])

  useEffect(() => {
    missionStationVectorSourceRef.current.clear(true)
    missionStationVectorSourceRef.current.addFeatures(stationsAsFeatures)
  }, [stationsAsFeatures])

  useEffect(() => {
    map.getLayers().push(missionStationVectorLayerRef.current)

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      map.removeLayer(missionStationVectorLayerRef.current)
    }
  }, [map])

  return null
}
