import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { useMemo, useEffect, useRef, useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { useGetMissionsQuery } from '../../../api/missionsAPI'
import { Layers } from '../../../domain/entities/layers'
import { selectMissionOnMap } from '../../../domain/use_cases/missions/selectMissionOnMap'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { getMissionZoneFeature } from './missionGeometryHelpers'
import { missionWithCentroidStyleFn } from './styles/missions.style'

import type { Geometry } from 'ol/geom'

const TWO_MINUTES = 2 * 60 * 1000
export function MissionsLayer({ map, mapClickEvent }) {
  const dispatch = useDispatch()
  const { displayMissionsLayer } = useAppSelector(state => state.global)
  const { missionStartedAfter, missionStartedBefore } = useAppSelector(state => state.missionFilters)
  const { data } = useGetMissionsQuery(
    {
      startedAfterDateTime: missionStartedAfter || undefined,
      startedBeforeDateTime: missionStartedBefore || undefined
    },
    { pollingInterval: TWO_MINUTES }
  )

  const missionsMultiPolygons = useMemo(
    () => data?.filter(f => !!f.geom).map(f => getMissionZoneFeature(f, Layers.MISSIONS.code)),
    [data]
  )

  const vectorSourceRef = useRef() as React.MutableRefObject<VectorSource<Geometry>>
  const GetVectorSource = () => {
    if (vectorSourceRef.current === undefined) {
      vectorSourceRef.current = new VectorSource()
    }

    return vectorSourceRef.current
  }

  const vectorLayerRef = useRef() as React.MutableRefObject<VectorLayer<VectorSource> & { name?: string }>
  const GetVectorLayer = useCallback(() => {
    if (vectorLayerRef.current === undefined) {
      vectorLayerRef.current = new VectorLayer({
        renderBuffer: 7,
        source: GetVectorSource(),
        style: missionWithCentroidStyleFn,
        updateWhileAnimating: true,
        updateWhileInteracting: true,
        zIndex: Layers.MISSIONS.zIndex
      })
      vectorLayerRef.current.name = Layers.MISSIONS.code
    }

    return vectorLayerRef.current
  }, [])

  useEffect(() => {
    if (map) {
      map.getLayers().push(GetVectorLayer())

      return () => map.removeLayer(GetVectorLayer())
    }

    return () => {}
  }, [map, GetVectorLayer])

  useEffect(() => {
    GetVectorSource()?.clear(true)
    if (missionsMultiPolygons) {
      GetVectorSource()?.addFeatures(missionsMultiPolygons)
    }
  }, [missionsMultiPolygons])

  useEffect(() => {
    GetVectorLayer()?.setVisible(displayMissionsLayer)
  }, [displayMissionsLayer, GetVectorLayer])

  useEffect(() => {
    if (mapClickEvent?.feature) {
      const feature = mapClickEvent?.feature
      if (feature.getId()?.toString()?.includes(Layers.MISSIONS.code)) {
        const { missionId } = feature.getProperties()
        dispatch(selectMissionOnMap(missionId))
      }
    }
  }, [dispatch, mapClickEvent])

  return null
}
