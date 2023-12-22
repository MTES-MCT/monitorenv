import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { type MutableRefObject, useCallback, useEffect, useRef, useMemo } from 'react'

import { getMissionZoneFeature, getActionsFeatures } from './missionGeometryHelpers'
import { selectedMissionStyle, selectedMissionActionsStyle } from './missions.style'
import { useGetMissionsQuery } from '../../../../api/missionsAPI'
import { Layers } from '../../../../domain/entities/layers/constants'
import { useAppSelector } from '../../../../hooks/useAppSelector'

import type { BaseMapChildrenProps } from '../../BaseMap'

export function SelectedMissionLayer({ map }: BaseMapChildrenProps) {
  const activeMissionId = useAppSelector(state => state.missionForms.activeMissionId)
  const selectedMissionIdOnMap = useAppSelector(state => state.mission.selectedMissionIdOnMap)
  const { displayMissionSelectedLayer } = useAppSelector(state => state.global)
  const { selectedMission } = useGetMissionsQuery(undefined, {
    selectFromResult: ({ data }) => ({
      selectedMission: data?.find(op => op.id === selectedMissionIdOnMap)
    })
  })

  const hasNoMissionConflict = useMemo(() => {
    if (!activeMissionId && !!selectedMissionIdOnMap) {
      return true
    }

    return !!activeMissionId && activeMissionId !== selectedMissionIdOnMap
  }, [activeMissionId, selectedMissionIdOnMap])

  const displaySelectedMission = displayMissionSelectedLayer && hasNoMissionConflict

  const selectedMissionVectorSourceRef = useRef() as MutableRefObject<VectorSource>
  const GetSelectedMissionVectorSource = () => {
    if (selectedMissionVectorSourceRef.current === undefined) {
      selectedMissionVectorSourceRef.current = new VectorSource()
    }

    return selectedMissionVectorSourceRef.current
  }

  const selectedMissionActionsVectorSourceRef = useRef() as MutableRefObject<VectorSource>
  const GetSelectedMissionActionsVectorSource = () => {
    if (selectedMissionActionsVectorSourceRef.current === undefined) {
      selectedMissionActionsVectorSourceRef.current = new VectorSource()
    }

    return selectedMissionActionsVectorSourceRef.current
  }

  const selectedMissionVectorLayerRef = useRef() as MutableRefObject<VectorLayer<VectorSource> & { name?: string }>
  const selectedMissionActionsVectorLayerRef = useRef() as MutableRefObject<
    VectorLayer<VectorSource> & { name?: string }
  >

  const GetSelectedMissionVectorLayer = useCallback(() => {
    if (selectedMissionVectorLayerRef.current === undefined) {
      selectedMissionVectorLayerRef.current = new VectorLayer({
        renderBuffer: 7,
        source: GetSelectedMissionVectorSource(),
        style: selectedMissionStyle,
        updateWhileAnimating: true,
        updateWhileInteracting: true,
        zIndex: Layers.MISSION_SELECTED.zIndex
      })
      selectedMissionVectorLayerRef.current.name = Layers.MISSION_SELECTED.code
    }

    return selectedMissionVectorLayerRef.current
  }, [])

  const GetSelectedMissionActionsVectorLayer = useCallback(() => {
    if (selectedMissionActionsVectorLayerRef.current === undefined) {
      selectedMissionActionsVectorLayerRef.current = new VectorLayer({
        renderBuffer: 7,
        source: GetSelectedMissionActionsVectorSource(),
        style: selectedMissionActionsStyle,
        updateWhileAnimating: true,
        updateWhileInteracting: true,
        zIndex: Layers.ACTIONS.zIndex
      })
      selectedMissionActionsVectorLayerRef.current.name = Layers.ACTIONS.code
    }

    return selectedMissionActionsVectorLayerRef.current
  }, [])

  useEffect(() => {
    if (map) {
      const layersCollection = map.getLayers()
      layersCollection.push(GetSelectedMissionVectorLayer())
      layersCollection.push(GetSelectedMissionActionsVectorLayer())
    }

    return () => {
      if (map) {
        map.removeLayer(GetSelectedMissionVectorLayer())
        map.removeLayer(GetSelectedMissionActionsVectorLayer())
      }
    }
  }, [map, GetSelectedMissionVectorLayer, GetSelectedMissionActionsVectorLayer])

  useEffect(() => {
    GetSelectedMissionVectorLayer()?.setVisible(displaySelectedMission)
    GetSelectedMissionActionsVectorLayer()?.setVisible(displaySelectedMission)
  }, [displaySelectedMission, GetSelectedMissionVectorLayer, GetSelectedMissionActionsVectorLayer])

  useEffect(() => {
    GetSelectedMissionVectorSource()?.clear(true)
    GetSelectedMissionActionsVectorSource()?.clear(true)
    if (selectedMission) {
      GetSelectedMissionVectorSource()?.addFeature(getMissionZoneFeature(selectedMission, Layers.MISSION_SELECTED.code))
      GetSelectedMissionActionsVectorSource()?.addFeatures(getActionsFeatures(selectedMission))
    }
  }, [selectedMission])

  return null
}
