import { hasAlreadyFeature } from '@features/map/layers/utils'
import { useAppSelector } from '@hooks/useAppSelector'
import { Layers } from 'domain/entities/layers/constants'
import { InteractionListener } from 'domain/entities/map/constants'
import { getOverlayCoordinates } from 'domain/shared_slices/Global'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { type MutableRefObject, useEffect, useRef, useMemo } from 'react'

import { getActionsFeatures, getMissionZoneFeature } from './missionGeometryHelpers'
import { selectedMissionStyle } from './missions.style'
import { getActiveMission } from '../MissionForm/slice'

import type { BaseMapChildrenProps } from '@features/map/BaseMap'
import type { VectorLayerWithName } from 'domain/types/layer'
import type { Feature } from 'ol'
import type { Geometry } from 'ol/geom'

export function EditingMissionLayer({ currentFeatureOver, map }: BaseMapChildrenProps) {
  const activeMissionId = useAppSelector(state => state.missionForms.activeMissionId)
  const selectedMissionIdOnMap = useAppSelector(state => state.mission.selectedMissionIdOnMap)
  const editingMission = useAppSelector(state => getActiveMission(state.missionForms)?.missionForm)

  const { displayMissionEditingLayer } = useAppSelector(state => state.global)
  const isMissionAttachmentInProgress = useAppSelector(
    state => state.attachMissionToReporting.isMissionAttachmentInProgress
  )

  const hasNoMissionDuplication = useMemo(() => {
    if (!selectedMissionIdOnMap && !!activeMissionId) {
      return true
    }

    return !!selectedMissionIdOnMap && activeMissionId === selectedMissionIdOnMap
  }, [activeMissionId, selectedMissionIdOnMap])

  // we don't want to display missions on the map if the user so decides (displayMissionEditingLayer variable)
  // or if user have interaction on map (edit mission zone, attach mission to reporting)
  const isLayerVisible = useMemo(
    () => displayMissionEditingLayer && !isMissionAttachmentInProgress && hasNoMissionDuplication,
    [displayMissionEditingLayer, isMissionAttachmentInProgress, hasNoMissionDuplication]
  )
  const listener = useAppSelector(state => state.draw.listener)
  const isEditingSurveillanceZoneOrControlPoint =
    listener === InteractionListener.SURVEILLANCE_ZONE || listener === InteractionListener.CONTROL_POINT

  const editingMissionVectorSourceRef = useRef(new VectorSource()) as MutableRefObject<VectorSource>
  const editingMissionVectorLayerRef = useRef(
    new VectorLayer({
      renderBuffer: 7,
      source: editingMissionVectorSourceRef.current,
      style: selectedMissionStyle,
      zIndex: Layers.MISSION_SELECTED.zIndex
    })
  ) as MutableRefObject<VectorLayerWithName>
  editingMissionVectorLayerRef.current.name = Layers.MISSION_SELECTED.code

  const editingMissionActionsVectorSourceRef = useRef(new VectorSource()) as MutableRefObject<
    VectorSource<Feature<Geometry>>
  >
  const editingMissionActionsVectorLayerRef = useRef(
    new VectorLayer({
      renderBuffer: 7,
      source: editingMissionActionsVectorSourceRef.current,
      zIndex: Layers.ACTIONS.zIndex
    })
  ) as MutableRefObject<VectorLayerWithName>
  editingMissionActionsVectorLayerRef.current.name = Layers.ACTIONS.code

  const feature = editingMissionVectorSourceRef.current.getFeatureById(
    `${Layers.MISSION_SELECTED.code}:${activeMissionId}`
  )
  const overlayCoordinates = useAppSelector(state => getOverlayCoordinates(state.global, String(feature?.getId())))

  useEffect(() => {
    feature?.setProperties({ overlayCoordinates })
  }, [feature, overlayCoordinates])

  useEffect(() => {
    if (map) {
      const layersCollection = map.getLayers()
      layersCollection.push(editingMissionVectorLayerRef.current)
      layersCollection.push(editingMissionActionsVectorLayerRef.current)
    }

    return () => {
      if (map) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        map.removeLayer(editingMissionVectorLayerRef.current)
        // eslint-disable-next-line react-hooks/exhaustive-deps
        map.removeLayer(editingMissionActionsVectorLayerRef.current)
      }
    }
  }, [map])

  useEffect(() => {
    editingMissionVectorLayerRef.current?.setVisible(isLayerVisible && !isEditingSurveillanceZoneOrControlPoint)
    editingMissionActionsVectorLayerRef.current?.setVisible(isLayerVisible)
  }, [isLayerVisible, isEditingSurveillanceZoneOrControlPoint])

  useEffect(() => {
    editingMissionVectorSourceRef.current?.clear(true)
    editingMissionActionsVectorSourceRef.current?.clear(true)
    if (editingMission) {
      if (
        !hasAlreadyFeature(currentFeatureOver, [
          `${Layers.MISSIONS.code}:${editingMission.id}`,
          `${Layers.MISSION_TO_ATTACH_ON_REPORTING.code}:${editingMission.id}`
        ])
      ) {
        editingMissionVectorSourceRef.current?.addFeature(
          getMissionZoneFeature(editingMission, Layers.MISSION_SELECTED.code)
        )
      }
      editingMissionActionsVectorSourceRef.current?.addFeatures(
        getActionsFeatures(editingMission, isEditingSurveillanceZoneOrControlPoint)
      )
    }
  }, [editingMission, currentFeatureOver, isEditingSurveillanceZoneOrControlPoint])

  return null
}
