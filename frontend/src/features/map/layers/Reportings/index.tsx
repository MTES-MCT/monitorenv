import { reduce } from 'lodash'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { useCallback, useEffect, useMemo, useRef } from 'react'

import { getReportingZoneFeature } from './reportingsGeometryHelpers'
import { reportingPinStyleFn } from './style'
import { Layers } from '../../../../domain/entities/layers/constants'
import { removeOverlayCoordinatesByName } from '../../../../domain/shared_slices/Global'
import { reportingActions } from '../../../../domain/shared_slices/reporting'
import { useAppDispatch } from '../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { useGetFilteredReportingsQuery } from '../../../Reportings/hooks/useGetFilteredReportingsQuery'

import type { ReportingDetailed } from '../../../../domain/entities/reporting'
import type { BaseMapChildrenProps } from '../../BaseMap'
import type { Feature } from 'ol'
import type { Geometry } from 'ol/geom'

export function ReportingsLayer({ map, mapClickEvent }: BaseMapChildrenProps) {
  const dispatch = useAppDispatch()
  const { displayReportingsLayer, overlayCoordinates } = useAppSelector(state => state.global)
  const { reportings: reportingsInStore } = useAppSelector(state => state.reporting)
  const activeReportingId = useAppSelector(state => state.reporting.activeReportingId)

  // we don't want to display reportings on the map if the user so decides (displayReportingsLayer variable)
  // or if user have interaction on map (attach mission or reporting)

  const attachMissionListener = useAppSelector(state => state.attachMissionToReporting.attachMissionListener)
  const attachReportingListener = useAppSelector(state => state.attachReportingToMission.attachReportingListener)
  const hasMapListener = attachMissionListener || attachReportingListener
  const isLayerVisible = useMemo(
    () => displayReportingsLayer && !hasMapListener,
    [displayReportingsLayer, hasMapListener]
  )

  // Active reporting
  const missionListener = useAppSelector(state => state.draw.listener)
  const activeReporting = useMemo(() => {
    if (reportingsInStore === undefined || !activeReportingId || !reportingsInStore[activeReportingId]) {
      return undefined
    }

    return reportingsInStore[activeReportingId]?.reporting as ReportingDetailed
  }, [activeReportingId, reportingsInStore])

  const activeReportingFeature = useMemo(() => {
    if (!activeReporting) {
      return []
    }

    return [getReportingZoneFeature(activeReporting, Layers.REPORTINGS.code)]
  }, [activeReporting])

  // Attached reportings to active mission
  const attachedReportingsToActiveMission = useAppSelector(state => state.missionState.missionState?.attachedReportings)
  const attachedReportingsToActiveMissionFeature = useMemo(() => {
    if (!attachedReportingsToActiveMission || attachedReportingsToActiveMission?.length === 0) {
      return []
    }

    return attachedReportingsToActiveMission.map(reporting =>
      getReportingZoneFeature(reporting, Layers.REPORTINGS.code)
    )
  }, [attachedReportingsToActiveMission])

  const { reportings } = useGetFilteredReportingsQuery()
  const reportingsFromApiFeatures = reduce(
    reportings,
    (features, reporting) => {
      if (reporting && reporting.geom && reporting.id !== activeReportingId) {
        features.push(getReportingZoneFeature(reporting, Layers.REPORTINGS.code))
      }

      return features
    },
    [] as Feature[]
  )

  const reportingsPointOrZone = useMemo(() => {
    // if user edits a mission with attached reportings and draw a zone or a point on map
    // we want to display only the attached reportings
    if (missionListener) {
      return [...attachedReportingsToActiveMissionFeature]
    }

    // we want to display reportings from API (with active filters), active reporting
    // and reportings attached to active mission
    return [...reportingsFromApiFeatures, ...attachedReportingsToActiveMissionFeature, ...activeReportingFeature]
  }, [attachedReportingsToActiveMissionFeature, activeReportingFeature, reportingsFromApiFeatures, missionListener])

  const vectorSourceRef = useRef() as React.MutableRefObject<VectorSource<Geometry>>
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
        style: reportingPinStyleFn,
        updateWhileAnimating: true,
        updateWhileInteracting: true,
        zIndex: Layers.REPORTINGS.zIndex
      })
      vectorLayerRef.current.name = Layers.REPORTINGS.code
    }

    return vectorLayerRef.current
  }, [])

  useEffect(() => {
    GetVectorSource().forEachFeature(feature => {
      const selectedReportingId = `${Layers.REPORTINGS.code}:${activeReportingId}`
      feature.setProperties({
        isSelected: feature.getId() === selectedReportingId,
        overlayCoordinates: feature.getId() === selectedReportingId ? overlayCoordinates : undefined
      })
    })
  }, [overlayCoordinates, activeReportingId])

  useEffect(() => {
    if (map) {
      map.getLayers().push(GetVectorLayer())

      return () => map.removeLayer(GetVectorLayer())
    }

    return () => {}
  }, [map, GetVectorLayer])

  useEffect(() => {
    GetVectorSource()?.clear(true)
    if (reportingsPointOrZone) {
      GetVectorSource()?.addFeatures(reportingsPointOrZone)
    }
  }, [reportingsPointOrZone])

  useEffect(() => {
    GetVectorLayer()?.setVisible(isLayerVisible)
  }, [GetVectorLayer, isLayerVisible])

  useEffect(() => {
    if (mapClickEvent?.feature) {
      const feature = mapClickEvent?.feature
      if (feature.getId()?.toString()?.includes(Layers.REPORTINGS.code)) {
        const { id } = feature.getProperties()
        dispatch(reportingActions.setSelectedReportingIdOnMap(id))
        dispatch(removeOverlayCoordinatesByName(Layers.REPORTINGS.code))
      }
    }
  }, [dispatch, mapClickEvent])

  return null
}
