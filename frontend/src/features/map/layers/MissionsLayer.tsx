import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useDispatch } from 'react-redux'

import { Layers } from '../../../domain/entities/layers/constants'
import { selectMissionOnMap } from '../../../domain/use_cases/missions/selectMissionOnMap'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { useGetFilteredMissionsQuery } from '../../../hooks/useGetFilteredMissionsQuery'
import { getMissionZoneFeature } from './missionGeometryHelpers'
import { missionWithCentroidStyleFn } from './styles/missions.style'

import type { MapChildrenProps } from '../Map'
import type { Geometry } from 'ol/geom'

export function MissionsLayer({ map, mapClickEvent }: MapChildrenProps) {
  const dispatch = useDispatch()
  const { displayMissionsLayer } = useAppSelector(state => state.global)
  const { missions } = useGetFilteredMissionsQuery()

  const missionsMultiPolygons = useMemo(
    () => missions?.filter(f => !!f.geom).map(f => getMissionZoneFeature(f, Layers.MISSIONS.code)),
    [missions]
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
