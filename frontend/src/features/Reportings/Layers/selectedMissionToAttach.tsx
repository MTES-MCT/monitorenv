import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { type MutableRefObject, useCallback, useEffect, useRef } from 'react'

import { attachedMissionStyle } from './style'
import { useGetMissionsQuery } from '../../../api/missionsAPI'
import { Layers } from '../../../domain/entities/layers/constants'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { getMissionZoneFeature } from '../../map/layers/Missions/missionGeometryHelpers'

import type { BaseMapChildrenProps } from '../../map/BaseMap'

export function SelectedMissionToAttachLayer({ map }: BaseMapChildrenProps) {
  const attachedMissionId = useAppSelector(state => state.attachReportingToMission.attachedMissionId)
  const { selectedMission: attachedMission } = useGetMissionsQuery(undefined, {
    selectFromResult: ({ data }) => ({
      selectedMission: data?.find(op => op.id === attachedMissionId)
    })
  })
  const selectedAttachedMissionVectorSourceRef = useRef() as MutableRefObject<VectorSource>
  const GetSelectedMissionVectorSource = () => {
    if (selectedAttachedMissionVectorSourceRef.current === undefined) {
      selectedAttachedMissionVectorSourceRef.current = new VectorSource()
    }

    return selectedAttachedMissionVectorSourceRef.current
  }

  const selectedAttachedMissionVectorLayerRef = useRef() as MutableRefObject<
    VectorLayer<VectorSource> & { name?: string }
  >

  const GetSelectedMissionVectorLayer = useCallback(() => {
    if (selectedAttachedMissionVectorLayerRef.current === undefined) {
      selectedAttachedMissionVectorLayerRef.current = new VectorLayer({
        renderBuffer: 7,
        source: GetSelectedMissionVectorSource(),
        style: attachedMissionStyle,
        updateWhileAnimating: true,
        updateWhileInteracting: true,
        zIndex: Layers.MISSION_TO_ATTACH_ON_REPORTING_SELECTED.zIndex
      })
      selectedAttachedMissionVectorLayerRef.current.name = Layers.MISSION_TO_ATTACH_ON_REPORTING_SELECTED.code
    }

    return selectedAttachedMissionVectorLayerRef.current
  }, [])

  useEffect(() => {
    if (map) {
      const layersCollection = map.getLayers()
      layersCollection.push(GetSelectedMissionVectorLayer())
    }

    return () => {
      if (map) {
        map.removeLayer(GetSelectedMissionVectorLayer())
      }
    }
  }, [map, GetSelectedMissionVectorLayer])

  useEffect(() => {
    GetSelectedMissionVectorLayer()?.setVisible(!!attachedMissionId)
  }, [attachedMissionId, GetSelectedMissionVectorLayer])

  useEffect(() => {
    GetSelectedMissionVectorSource()?.clear(true)
    if (attachedMission) {
      GetSelectedMissionVectorSource()?.addFeature(
        getMissionZoneFeature(attachedMission, Layers.MISSION_TO_ATTACH_ON_REPORTING_SELECTED.code)
      )
    }
  }, [attachedMission])

  return null
}
