import { removeOverlayCoordinatesByName } from 'domain/shared_slices/Global'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { useCallback, useEffect, useMemo, useRef } from 'react'

import { getMissionZoneFeature } from './missionGeometryHelpers'
import { missionWithCentroidStyleFn } from './missions.style'
import { Layers } from '../../../../domain/entities/layers/constants'
import { useAppDispatch } from '../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { useGetFilteredMissionsQuery } from '../../../../hooks/useGetFilteredMissionsQuery'
import { useHasMapInteraction } from '../../../../hooks/useHasMapInteraction'
import { missionActions } from '../../../missions/slice'

import type { BaseMapChildrenProps } from '../../BaseMap'
import type { Feature } from 'ol'
import type { Geometry } from 'ol/geom'

export function MissionsLayer({ map, mapClickEvent }: BaseMapChildrenProps) {
  const dispatch = useAppDispatch()
  const { displayMissionsLayer } = useAppSelector(state => state.global)
  const { missions } = useGetFilteredMissionsQuery()

  // mission attached to active reporting
  const reportings = useAppSelector(state => state.reporting.reportings)
  const activeReportingId = useAppSelector(state => state.reporting.activeReportingId)
  const missionAttachedToReporting = useMemo(() => {
    if (
      reportings === undefined ||
      !activeReportingId ||
      !reportings[activeReportingId] ||
      reportings[activeReportingId]?.reporting.detachedFromMissionAtUtc
    ) {
      return undefined
    }

    return reportings[activeReportingId]?.reporting.attachedMission
  }, [activeReportingId, reportings])

  const missionAttachedToReportingFeature = useMemo(() => {
    if (!missionAttachedToReporting) {
      return []
    }

    return [getMissionZoneFeature(missionAttachedToReporting, Layers.MISSIONS.code)]
  }, [missionAttachedToReporting])

  // active mission
  const activeMissionId = useAppSelector(state => state.missionForms.activeMissionId)
  const activeMission = useAppSelector(state =>
    activeMissionId ? state.missionForms.missions[activeMissionId]?.missionForm : undefined
  )
  const activeMissionFeature = useMemo(() => {
    if (!activeMission) {
      return []
    }

    return [getMissionZoneFeature(activeMission, Layers.MISSIONS.code)]
  }, [activeMission])

  // we want to display missions from API (with active filters), active mission
  // and mission attached to active reporting
  const missionsMultiPolygons = useMemo(() => {
    const missionFromApi = missions
      ?.filter(
        mission => !!mission.geom && mission.id !== activeMission?.id && mission.id !== missionAttachedToReporting?.id
      )
      .map(filteredMission => getMissionZoneFeature(filteredMission, Layers.MISSIONS.code))

    if (!displayMissionsLayer && missionAttachedToReporting) {
      return missionAttachedToReportingFeature
    }

    return [...missionFromApi, ...activeMissionFeature, ...missionAttachedToReportingFeature]
  }, [
    activeMission?.id,
    displayMissionsLayer,
    missions,
    activeMissionFeature,
    missionAttachedToReporting,
    missionAttachedToReportingFeature
  ])

  // we don't want to display missions on the map if the user so decides (displayMissionsLayer variable)
  // or if user have interaction on map (edit mission zone, attach reporting or mission)
  const hasMapInteraction = useHasMapInteraction()
  const isLayerVisible = useMemo(
    () => (displayMissionsLayer && !hasMapInteraction) || !!missionAttachedToReporting,
    [displayMissionsLayer, hasMapInteraction, missionAttachedToReporting]
  )

  const vectorSourceRef = useRef() as React.MutableRefObject<VectorSource<Feature<Geometry>>>
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
    GetVectorLayer()?.setVisible(isLayerVisible)
  }, [GetVectorLayer, isLayerVisible])

  useEffect(() => {
    if (mapClickEvent?.feature) {
      const feature = mapClickEvent?.feature
      if (feature.getId()?.toString()?.includes(Layers.MISSIONS.code)) {
        const { missionId } = feature.getProperties()
        dispatch(missionActions.setSelectedMissionIdOnMap(missionId))
        dispatch(removeOverlayCoordinatesByName(Layers.MISSIONS.code))
      }
    }
  }, [dispatch, mapClickEvent])

  return null
}
