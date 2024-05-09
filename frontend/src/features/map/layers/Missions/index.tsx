import { missionActions } from '@features/Mission/slice'
import { removeOverlayCoordinatesByName } from 'domain/shared_slices/Global'
import { convertToFeature } from 'domain/types/map'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { useEffect, useMemo, useRef, type MutableRefObject } from 'react'

import { getMissionZoneFeature } from './missionGeometryHelpers'
import { missionStyleFn } from './missions.style'
import { Layers } from '../../../../domain/entities/layers/constants'
import { useAppDispatch } from '../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { useGetFilteredMissionsQuery } from '../../../../hooks/useGetFilteredMissionsQuery'
import { useHasMapInteraction } from '../../../../hooks/useHasMapInteraction'

import type { BaseMapChildrenProps } from '../../BaseMap'
import type { VectorLayerWithName } from 'domain/types/layer'
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

  const missionVectorSourceRef = useRef(new VectorSource()) as MutableRefObject<VectorSource<Feature<Geometry>>>
  const missionVectorLayerRef = useRef(
    new VectorLayer({
      renderBuffer: 7,
      source: missionVectorSourceRef.current,
      style: missionStyleFn,
      updateWhileAnimating: true,
      updateWhileInteracting: true,
      zIndex: Layers.MISSIONS.zIndex
    })
  ) as MutableRefObject<VectorLayerWithName>
  ;(missionVectorLayerRef.current as VectorLayerWithName).name = Layers.MISSIONS.code

  useEffect(() => {
    if (map) {
      map.getLayers().push(missionVectorLayerRef.current)

      // eslint-disable-next-line react-hooks/exhaustive-deps
      return () => map.removeLayer(missionVectorLayerRef.current)
    }

    return () => {}
  }, [map])

  useEffect(() => {
    missionVectorSourceRef.current?.clear(true)
    if (missionsMultiPolygons) {
      missionVectorSourceRef.current?.addFeatures(missionsMultiPolygons)
    }
  }, [missionsMultiPolygons])

  useEffect(() => {
    missionVectorLayerRef.current?.setVisible(isLayerVisible)
  }, [isLayerVisible])

  useEffect(() => {
    const feature = convertToFeature(mapClickEvent?.feature)
    if (feature) {
      if (feature.getId()?.toString()?.includes(Layers.MISSIONS.code)) {
        const { missionId } = feature.getProperties()
        dispatch(missionActions.setSelectedMissionIdOnMap(missionId))
        dispatch(removeOverlayCoordinatesByName(Layers.MISSIONS.code))
      }
    }
  }, [dispatch, mapClickEvent])

  return null
}
