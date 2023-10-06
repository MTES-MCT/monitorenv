import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { type MutableRefObject, useCallback, useEffect, useRef } from 'react'

import { attachedReportingStyle } from './style'
import { useGetReportingsQuery } from '../../../../api/reportingsAPI'
import { Layers } from '../../../../domain/entities/layers/constants'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { getReportingZoneFeature } from '../../../map/layers/Reportings/reportingsGeometryHelpers'

import type { BaseMapChildrenProps } from '../../../map/BaseMap'

export function SelectedReportingToAttachLayer({ map }: BaseMapChildrenProps) {
  const attachReportingListener = useAppSelector(state => state.attachReportingToMission.attachReportingListener)

  const attachedReportingIds = useAppSelector(state => state.missionState.missionState?.attachedReportingIds || [])
  const { attachedReportings } = useGetReportingsQuery(undefined, {
    selectFromResult: ({ data }) => ({
      attachedReportings:
        data &&
        Object.values(data?.entities).find(
          reporting => reporting && attachedReportingIds.includes(reporting.id as number)
        )
    })
  })
  const selectedAttachedReportingVectorSourceRef = useRef() as MutableRefObject<VectorSource>
  const GetSelectedReportingVectorSource = () => {
    if (selectedAttachedReportingVectorSourceRef.current === undefined) {
      selectedAttachedReportingVectorSourceRef.current = new VectorSource()
    }

    return selectedAttachedReportingVectorSourceRef.current
  }

  const selectedAttachedReportingVectorLayerRef = useRef() as MutableRefObject<
    VectorLayer<VectorSource> & { name?: string }
  >

  const GetSelectedMissionVectorLayer = useCallback(() => {
    if (selectedAttachedReportingVectorLayerRef.current === undefined) {
      selectedAttachedReportingVectorLayerRef.current = new VectorLayer({
        renderBuffer: 7,
        source: GetSelectedReportingVectorSource(),
        style: attachedReportingStyle,
        updateWhileAnimating: true,
        updateWhileInteracting: true,
        zIndex: Layers.SELECTED_REPORTING_TO_ATTACH_ON_MISSION.zIndex
      })
      selectedAttachedReportingVectorLayerRef.current.name = Layers.SELECTED_REPORTING_TO_ATTACH_ON_MISSION.code
    }

    return selectedAttachedReportingVectorLayerRef.current
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
    GetSelectedMissionVectorLayer()?.setVisible(attachedReportingIds.length > 0 && attachReportingListener)
  }, [attachedReportingIds, attachReportingListener, GetSelectedMissionVectorLayer])

  useEffect(() => {
    GetSelectedReportingVectorSource()?.clear(true)
    if (attachedReportings) {
      GetSelectedReportingVectorSource()?.addFeature(
        getReportingZoneFeature(attachedReportings, Layers.SELECTED_REPORTING_TO_ATTACH_ON_MISSION.code)
      )
    }
  }, [attachedReportings])

  return null
}
