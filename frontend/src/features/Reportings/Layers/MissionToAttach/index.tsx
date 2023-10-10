import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useDispatch } from 'react-redux'

import { useGetMissionsQuery } from '../../../../api/missionsAPI'
import { Layers } from '../../../../domain/entities/layers/constants'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { getMissionZoneFeature } from '../../../map/layers/Missions/missionGeometryHelpers'
import { missionWithCentroidStyleFn } from '../../../map/layers/Missions/missions.style'
import { attachMissionToReportingSliceActions } from '../../ReportingForm/AttachMission/slice'

import type { BaseMapChildrenProps } from '../../../map/BaseMap'
import type { Geometry } from 'ol/geom'

export function MissionToAttachLayer({ map, mapClickEvent }: BaseMapChildrenProps) {
  const dispatch = useDispatch()
  const attachMissionListener = useAppSelector(state => state.attachMissionToReporting.attachMissionListener)
  const { data: missions } = useGetMissionsQuery({
    missionStatus: ['PENDING']
  })

  const missionsMultiPolygons = useMemo(
    () =>
      missions?.filter(f => !!f.geom).map(f => getMissionZoneFeature(f, Layers.MISSION_TO_ATTACH_ON_REPORTING.code)),
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
        zIndex: Layers.MISSION_TO_ATTACH_ON_REPORTING.zIndex
      })
      vectorLayerRef.current.name = Layers.MISSION_TO_ATTACH_ON_REPORTING.code
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
    GetVectorLayer()?.setVisible(attachMissionListener)
  }, [attachMissionListener, GetVectorLayer])

  useEffect(() => {
    if (mapClickEvent?.feature) {
      const feature = mapClickEvent?.feature
      if (feature.getId()?.toString()?.includes(Layers.MISSION_TO_ATTACH_ON_REPORTING.code)) {
        const { missionId } = feature.getProperties()
        dispatch(attachMissionToReportingSliceActions.setAttachedMissionId(missionId))
      }
    }
  }, [dispatch, mapClickEvent])

  return null
}
