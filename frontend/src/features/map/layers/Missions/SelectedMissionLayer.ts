import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { type MutableRefObject, useEffect, useRef, useMemo } from 'react'

import { getMissionZoneFeature, getActionsFeatures } from './missionGeometryHelpers'
import { selectedMissionStyle } from './missions.style'
import { useGetMissionsQuery } from '../../../../api/missionsAPI'
import { Layers } from '../../../../domain/entities/layers/constants'
import { useAppSelector } from '../../../../hooks/useAppSelector'

import type { BaseMapChildrenProps } from '../../BaseMap'
import type { VectorLayerWithName } from 'domain/types/layer'
import type { Feature } from 'ol'
import type { Geometry } from 'ol/geom'

export function SelectedMissionLayer({ map }: BaseMapChildrenProps) {
  const activeMissionId = useAppSelector(state => state.missionForms.activeMissionId)
  const selectedMissionIdOnMap = useAppSelector(state => state.mission.selectedMissionIdOnMap)
  const displayMissionSelectedLayer = useAppSelector(state => state.global.displayMissionSelectedLayer)
  const overlayCoordinates = useAppSelector(state => state.global.overlayCoordinates)
  const { selectedMission } = useGetMissionsQuery(undefined, {
    selectFromResult: ({ data }) => ({
      selectedMission: data?.find(op => op.id === selectedMissionIdOnMap)
    }),
    skip: !selectedMissionIdOnMap
  })

  const hasNoMissionDuplication = useMemo(() => {
    if (!activeMissionId && !!selectedMissionIdOnMap) {
      return true
    }

    return !!activeMissionId && activeMissionId !== selectedMissionIdOnMap
  }, [activeMissionId, selectedMissionIdOnMap])

  const displaySelectedMission = displayMissionSelectedLayer && hasNoMissionDuplication

  const selectedMissionVectorSourceRef = useRef(new VectorSource()) as MutableRefObject<VectorSource<Feature<Geometry>>>
  const selectedMissionVectorLayerRef = useRef(
    new VectorLayer({
      renderBuffer: 7,
      source: selectedMissionVectorSourceRef.current,
      style: selectedMissionStyle,
      updateWhileAnimating: true,
      updateWhileInteracting: true,
      zIndex: Layers.MISSION_SELECTED.zIndex
    })
  ) as MutableRefObject<VectorLayerWithName>
  ;(selectedMissionVectorLayerRef.current as VectorLayerWithName).name = Layers.MISSION_SELECTED.code

  const selectedMissionActionsVectorSourceRef = useRef(new VectorSource()) as MutableRefObject<
    VectorSource<Feature<Geometry>>
  >
  const selectedMissionActionsVectorLayerRef = useRef(
    new VectorLayer({
      renderBuffer: 7,
      source: selectedMissionActionsVectorSourceRef.current,
      updateWhileAnimating: true,
      updateWhileInteracting: true,
      zIndex: Layers.ACTIONS.zIndex
    })
  ) as MutableRefObject<VectorLayerWithName>
  ;(selectedMissionActionsVectorLayerRef.current as VectorLayerWithName).name = Layers.ACTIONS.code

  useEffect(() => {
    const feature = selectedMissionVectorSourceRef.current.getFeatureById(
      `${Layers.MISSION_SELECTED.code}:${selectedMissionIdOnMap}`
    )
    feature?.setProperties({
      overlayCoordinates: overlayCoordinates[Layers.MISSIONS.code]
    })
  }, [overlayCoordinates, selectedMissionIdOnMap])

  useEffect(() => {
    if (map) {
      const layersCollection = map.getLayers()
      layersCollection.push(selectedMissionVectorLayerRef.current)
      layersCollection.push(selectedMissionActionsVectorLayerRef.current)
    }

    return () => {
      if (map) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        map.removeLayer(selectedMissionVectorLayerRef.current)
        // eslint-disable-next-line react-hooks/exhaustive-deps
        map.removeLayer(selectedMissionActionsVectorLayerRef.current)
      }
    }
  }, [map, selectedMissionVectorLayerRef, selectedMissionActionsVectorLayerRef])

  useEffect(() => {
    selectedMissionVectorLayerRef.current?.setVisible(displaySelectedMission)
    selectedMissionActionsVectorLayerRef.current?.setVisible(displaySelectedMission)
  }, [displaySelectedMission])

  useEffect(() => {
    selectedMissionVectorSourceRef.current?.clear(true)
    selectedMissionActionsVectorSourceRef.current?.clear(true)
    if (selectedMission) {
      selectedMissionVectorSourceRef.current?.addFeature(
        getMissionZoneFeature(selectedMission, Layers.MISSION_SELECTED.code)
      )
      selectedMissionActionsVectorSourceRef.current?.addFeatures(getActionsFeatures(selectedMission))
    }
  }, [selectedMission])

  return null
}
