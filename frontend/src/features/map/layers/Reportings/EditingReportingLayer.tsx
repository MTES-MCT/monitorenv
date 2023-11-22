import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { type MutableRefObject, useEffect, useRef, useMemo } from 'react'

import { getEditingReportingZoneFeature } from './reportingsGeometryHelpers'
import { editingReportingStyleFn } from './style'
import { Layers } from '../../../../domain/entities/layers/constants'
import { VisibilityState } from '../../../../domain/shared_slices/Global'
import { useAppSelector } from '../../../../hooks/useAppSelector'

import type { VectorLayerWithName } from '../../../../domain/types/layer'
import type { BaseMapChildrenProps } from '../../BaseMap'

export function EditingReportingLayer({ map }: BaseMapChildrenProps) {
  const activeReportingId = useAppSelector(state => state.reporting.activeReportingId)
  const selectedReportingIdOnMap = useAppSelector(state => state.reporting.selectedReportingIdOnMap)

  const displayReportingEditingLayer = useAppSelector(state => state.global.displayReportingEditingLayer)
  const reportingFormVisibility = useAppSelector(state => state.global.reportingFormVisibility)

  const editingReporting = useAppSelector(state =>
    activeReportingId ? state.reporting.reportings[activeReportingId]?.reporting : undefined
  )
  const overlayCoordinates = useAppSelector(state => state.global.overlayCoordinates)

  const listener = useAppSelector(state => state.draw.listener)
  const isReportingAttachmentInProgress = useAppSelector(
    state => state.attachReportingToMission.isReportingAttachmentInProgress
  )

  const hasNoReportingConflict = useMemo(() => {
    if (!selectedReportingIdOnMap && !!activeReportingId) {
      return true
    }

    return !!selectedReportingIdOnMap && activeReportingId === selectedReportingIdOnMap
  }, [activeReportingId, selectedReportingIdOnMap])

  // we don't want to display reportings on the map if the user so decides (displayMissionEditingLayer variable)
  // or if user have interaction on map (edit mission zone, attach reporting to mission)
  // or if user selected on map an other reporting (to avoid conflict)
  // or if user reduced the reporting form
  const isLayerVisible = useMemo(
    () =>
      displayReportingEditingLayer &&
      !listener &&
      !isReportingAttachmentInProgress &&
      hasNoReportingConflict &&
      reportingFormVisibility.visibility !== VisibilityState.REDUCED,
    [
      displayReportingEditingLayer,
      listener,
      isReportingAttachmentInProgress,
      hasNoReportingConflict,
      reportingFormVisibility.visibility
    ]
  )

  const editingReportingVectorSourceRef = useRef(new VectorSource()) as MutableRefObject<VectorSource>

  const editingReportingVectorLayerRef = useRef(
    new VectorLayer({
      renderBuffer: 7,
      source: editingReportingVectorSourceRef.current,
      style: editingReportingStyleFn,
      updateWhileAnimating: true,
      updateWhileInteracting: true,
      zIndex: Layers.REPORTING_SELECTED.zIndex
    })
  ) as MutableRefObject<VectorLayerWithName>
  ;(editingReportingVectorLayerRef.current as VectorLayerWithName).name = Layers.REPORTING_SELECTED.code

  useEffect(() => {
    const feature = editingReportingVectorSourceRef.current.getFeatureById(
      `${Layers.REPORTING_SELECTED.code}:${activeReportingId}`
    )

    feature?.setProperties({
      overlayCoordinates: overlayCoordinates.reportings
    })
  }, [overlayCoordinates, activeReportingId])

  useEffect(() => {
    map.getLayers().push(editingReportingVectorLayerRef.current)

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      map.removeLayer(editingReportingVectorLayerRef.current)
    }
  }, [map])

  useEffect(() => {
    editingReportingVectorLayerRef.current?.setVisible(isLayerVisible)
  }, [isLayerVisible])

  useEffect(() => {
    editingReportingVectorSourceRef.current?.clear(true)
    if (editingReporting) {
      const reportingFeature = getEditingReportingZoneFeature(editingReporting, Layers.REPORTING_SELECTED.code)
      editingReportingVectorSourceRef.current?.addFeature(reportingFeature)
    }
  }, [editingReporting])

  return null
}
