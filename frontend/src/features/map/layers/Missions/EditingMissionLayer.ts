import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { type MutableRefObject, useCallback, useEffect, useRef, useMemo } from 'react'

import { getMissionZoneFeature, getActionsFeatures } from './missionGeometryHelpers'
import { selectedMissionStyle, selectedMissionActionsStyle } from './missions.style'
import { Layers } from '../../../../domain/entities/layers/constants'
import { useAppSelector } from '../../../../hooks/useAppSelector'

import type { VectorLayerWithName } from '../../../../domain/types/layer'
import type { BaseMapChildrenProps } from '../../BaseMap'

export function EditingMissionLayer({ map }: BaseMapChildrenProps) {
  const activeMissionId = useAppSelector(state => state.missionForms.activeMissionId)
  const selectedMissionIdOnMap = useAppSelector(state => state.mission.selectedMissionIdOnMap)
  const editingMission = useAppSelector(state =>
    activeMissionId ? state.missionForms.missions[activeMissionId]?.missionForm : undefined
  )
  const { displayMissionEditingLayer } = useAppSelector(state => state.global)
  const isMissionAttachmentInProgress = useAppSelector(
    state => state.attachMissionToReporting.isMissionAttachmentInProgress
  )

  const hasNoMissionConflict = useMemo(() => {
    if (!selectedMissionIdOnMap && !!activeMissionId) {
      return true
    }

    return !!selectedMissionIdOnMap && activeMissionId === selectedMissionIdOnMap
  }, [activeMissionId, selectedMissionIdOnMap])

  // we don't want to display missions on the map if the user so decides (displayMissionEditingLayer variable)
  // or if user have interaction on map (edit mission zone, attach mission to reporting)
  const isLayerVisible = useMemo(
    () => displayMissionEditingLayer && !isMissionAttachmentInProgress && hasNoMissionConflict,
    [displayMissionEditingLayer, isMissionAttachmentInProgress, hasNoMissionConflict]
  )

  const editingMissionVectorSourceRef = useRef() as MutableRefObject<VectorSource>
  const GetEditingMissionVectorSource = () => {
    if (editingMissionVectorSourceRef.current === undefined) {
      editingMissionVectorSourceRef.current = new VectorSource()
    }

    return editingMissionVectorSourceRef.current
  }

  const editingMissionActionsVectorSourceRef = useRef() as MutableRefObject<VectorSource>
  const GetEditingMissionActionsVectorSource = () => {
    if (editingMissionActionsVectorSourceRef.current === undefined) {
      editingMissionActionsVectorSourceRef.current = new VectorSource()
    }

    return editingMissionActionsVectorSourceRef.current
  }

  const editingMissionVectorLayerRef = useRef() as MutableRefObject<VectorLayerWithName>
  const editingMissionActionsVectorLayerRef = useRef() as MutableRefObject<VectorLayerWithName>

  const GetSelectedMissionVectorLayer = useCallback(() => {
    if (editingMissionVectorLayerRef.current === undefined) {
      editingMissionVectorLayerRef.current = new VectorLayer({
        renderBuffer: 7,
        source: GetEditingMissionVectorSource(),
        style: selectedMissionStyle,
        updateWhileAnimating: true,
        updateWhileInteracting: true,
        zIndex: Layers.MISSION_SELECTED.zIndex
      })
      editingMissionVectorLayerRef.current.name = Layers.MISSION_SELECTED.code
    }

    return editingMissionVectorLayerRef.current
  }, [])

  const GetSelectedMissionActionsVectorLayer = useCallback(() => {
    if (editingMissionActionsVectorLayerRef.current === undefined) {
      editingMissionActionsVectorLayerRef.current = new VectorLayer({
        renderBuffer: 7,
        source: GetEditingMissionActionsVectorSource(),
        style: selectedMissionActionsStyle,
        updateWhileAnimating: true,
        updateWhileInteracting: true,
        zIndex: Layers.ACTIONS.zIndex
      })
      editingMissionActionsVectorLayerRef.current.name = Layers.ACTIONS.code
    }

    return editingMissionActionsVectorLayerRef.current
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
    GetSelectedMissionVectorLayer()?.setVisible(isLayerVisible)
    GetSelectedMissionActionsVectorLayer()?.setVisible(isLayerVisible)
  }, [isLayerVisible, GetSelectedMissionVectorLayer, GetSelectedMissionActionsVectorLayer])

  useEffect(() => {
    GetEditingMissionVectorSource()?.clear(true)
    GetEditingMissionActionsVectorSource()?.clear(true)
    if (editingMission) {
      GetEditingMissionVectorSource()?.addFeature(getMissionZoneFeature(editingMission, Layers.MISSION_SELECTED.code))
      GetEditingMissionActionsVectorSource()?.addFeatures(getActionsFeatures(editingMission))
    }
  }, [editingMission])

  return null
}
