import { getMissionZoneFeature } from '@features/Mission/components/Layers/missionGeometryHelpers'
import { missionStyleFn } from '@features/Mission/components/Layers/missions.style'
import { customDayjs } from '@mtes-mct/monitor-ui'
import { convertToFeature } from 'domain/types/map'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { useEffect, useMemo, useRef, type MutableRefObject } from 'react'

import { useGetMissionsQuery } from '../../../../../api/missionsAPI'
import { Layers } from '../../../../../domain/entities/layers/constants'
import { MissionStatusEnum } from '../../../../../domain/entities/missions'
import { useAppDispatch } from '../../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../../hooks/useAppSelector'
import { attachMission } from '../../../useCases/attachMission'

import type { VectorLayerWithName } from '../../../../../domain/types/layer'
import type { BaseMapChildrenProps } from '../../../../map/BaseMap'
import type { Feature } from 'ol'
import type { Geometry } from 'ol/geom'

export function MissionToAttachLayer({ map, mapClickEvent }: BaseMapChildrenProps) {
  const dispatch = useAppDispatch()
  const isMissionAttachmentInProgress = useAppSelector(
    state => state.attachMissionToReporting.isMissionAttachmentInProgress
  )

  const { data: missions } = useGetMissionsQuery(
    {
      missionStatus: [MissionStatusEnum.PENDING],
      startedAfterDateTime: customDayjs.utc().startOf('day').subtract(90, 'day').toISOString()
    },
    { skip: !isMissionAttachmentInProgress }
  )

  const missionsMultiPolygons = useMemo(
    () =>
      missions?.filter(f => !!f.geom).map(f => getMissionZoneFeature(f, Layers.MISSION_TO_ATTACH_ON_REPORTING.code)),
    [missions]
  )

  const vectorSourceRef = useRef(new VectorSource()) as React.MutableRefObject<VectorSource<Feature<Geometry>>>

  const vectorLayerRef = useRef(
    new VectorLayer({
      renderBuffer: 7,
      source: vectorSourceRef.current,
      style: missionStyleFn,
      zIndex: Layers.MISSION_TO_ATTACH_ON_REPORTING.zIndex
    })
  ) as MutableRefObject<VectorLayerWithName>
  ;(vectorLayerRef.current as VectorLayerWithName).name = Layers.MISSION_TO_ATTACH_ON_REPORTING.code

  useEffect(() => {
    map.getLayers().push(vectorLayerRef.current)

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      map.removeLayer(vectorLayerRef.current)
    }
  }, [map])

  useEffect(() => {
    vectorSourceRef.current?.clear(true)
    if (missionsMultiPolygons) {
      vectorSourceRef.current?.addFeatures(missionsMultiPolygons)
    }
  }, [missionsMultiPolygons])

  useEffect(() => {
    vectorLayerRef.current?.setVisible(isMissionAttachmentInProgress)
  }, [isMissionAttachmentInProgress])

  useEffect(() => {
    const feature = convertToFeature(mapClickEvent?.feature)
    if (feature && feature.getId()?.toString()?.includes(Layers.MISSION_TO_ATTACH_ON_REPORTING.code)) {
      const { missionId } = feature.getProperties()
      dispatch(attachMission(missionId))
    }
  }, [dispatch, mapClickEvent])

  return null
}
