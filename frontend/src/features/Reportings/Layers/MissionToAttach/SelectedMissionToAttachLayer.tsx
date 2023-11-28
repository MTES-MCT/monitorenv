import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { type MutableRefObject, useEffect, useRef } from 'react'

import { attachedMissionStyle } from './style'
import { useGetMissionsQuery } from '../../../../api/missionsAPI'
import { Layers } from '../../../../domain/entities/layers/constants'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { getMissionZoneFeature } from '../../../map/layers/Missions/missionGeometryHelpers'

import type { VectorLayerWithName } from '../../../../domain/types/layer'
import type { BaseMapChildrenProps } from '../../../map/BaseMap'

export function SelectedMissionToAttachLayer({ map }: BaseMapChildrenProps) {
  const isMissionAttachmentInProgress = useAppSelector(
    state => state.attachMissionToReporting.isMissionAttachmentInProgress
  )
  const activeReportingId = useAppSelector(state => state.reporting.activeReportingId)

  const editedReporting = useAppSelector(state =>
    activeReportingId ? state.reporting.reportings[activeReportingId]?.reporting : undefined
  )
  const missionId = useAppSelector(state => state.attachMissionToReporting.missionId)
  const { selectedMission: attachedMission } = useGetMissionsQuery(undefined, {
    selectFromResult: ({ data }) => ({
      selectedMission: data?.find(mission => mission.id === missionId && !editedReporting?.detachedFromMissionAtUtc)
    })
  })
  const selectedAttachedMissionVectorSourceRef = useRef(new VectorSource()) as MutableRefObject<VectorSource>

  const selectedAttachedMissionVectorLayerRef = useRef(
    new VectorLayer({
      renderBuffer: 7,
      source: selectedAttachedMissionVectorSourceRef.current,
      style: attachedMissionStyle,
      updateWhileAnimating: true,
      updateWhileInteracting: true,
      zIndex: Layers.SELECTED_MISSION_TO_ATTACH_ON_REPORTING.zIndex
    })
  ) as MutableRefObject<VectorLayerWithName>

  ;(selectedAttachedMissionVectorLayerRef.current as VectorLayerWithName).name =
    Layers.SELECTED_MISSION_TO_ATTACH_ON_REPORTING.code

  useEffect(() => {
    map.getLayers().push(selectedAttachedMissionVectorLayerRef.current)

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      map.removeLayer(selectedAttachedMissionVectorLayerRef.current)
    }
  }, [map])

  useEffect(() => {
    selectedAttachedMissionVectorLayerRef.current.setVisible(!!missionId && isMissionAttachmentInProgress)
  }, [missionId, isMissionAttachmentInProgress])

  useEffect(() => {
    selectedAttachedMissionVectorSourceRef.current?.clear(true)
    if (attachedMission) {
      selectedAttachedMissionVectorSourceRef.current?.addFeature(
        getMissionZoneFeature(attachedMission, Layers.SELECTED_MISSION_TO_ATTACH_ON_REPORTING.code)
      )
    }
  }, [attachedMission])

  return null
}
