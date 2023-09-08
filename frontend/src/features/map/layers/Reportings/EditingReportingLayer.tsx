import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { MutableRefObject, useCallback, useEffect, useRef } from 'react'

import { getEditingReportingZoneFeature } from './reportingsGeometryHelpers'
import { editingReportingStyleFn } from './style'
import { Layers } from '../../../../domain/entities/layers/constants'
import { useAppSelector } from '../../../../hooks/useAppSelector'

import type { VectorLayerWithName } from '../../../../domain/types/layer'
import type { BaseMapChildrenProps } from '../../BaseMap'

export function EditingReportingLayer({ map }: BaseMapChildrenProps) {
  const { activeReportingId, selectedReportings } = useAppSelector(state => state.multiReportings)
  const { displayReportingEditingLayer } = useAppSelector(state => state.global)
  const reportingState = selectedReportings.find(reporting => reporting.reporting.id === activeReportingId)?.reporting
  const editingReportingVectorSourceRef = useRef() as MutableRefObject<VectorSource>
  const GetEditingReportingVectorSource = () => {
    if (editingReportingVectorSourceRef.current === undefined) {
      editingReportingVectorSourceRef.current = new VectorSource()
    }

    return editingReportingVectorSourceRef.current
  }

  const editingReportingActionsVectorSourceRef = useRef() as MutableRefObject<VectorSource>
  const GetEditingReportingActionsVectorSource = () => {
    if (editingReportingActionsVectorSourceRef.current === undefined) {
      editingReportingActionsVectorSourceRef.current = new VectorSource()
    }

    return editingReportingActionsVectorSourceRef.current
  }

  const editingReportingVectorLayerRef = useRef() as MutableRefObject<VectorLayerWithName>

  const GetSelectedReportingVectorLayer = useCallback(() => {
    if (editingReportingVectorLayerRef.current === undefined) {
      editingReportingVectorLayerRef.current = new VectorLayer({
        renderBuffer: 7,
        source: GetEditingReportingVectorSource(),
        style: editingReportingStyleFn,
        updateWhileAnimating: true,
        updateWhileInteracting: true,
        zIndex: Layers.REPORTING_SELECTED.zIndex
      })
      editingReportingVectorLayerRef.current.name = Layers.REPORTING_SELECTED.code
    }

    return editingReportingVectorLayerRef.current
  }, [])

  useEffect(() => {
    if (map) {
      const layersCollection = map.getLayers()
      layersCollection.push(GetSelectedReportingVectorLayer())
    }

    return () => {
      if (map) {
        map.removeLayer(GetSelectedReportingVectorLayer())
      }
    }
  }, [map, GetSelectedReportingVectorLayer])

  useEffect(() => {
    GetSelectedReportingVectorLayer()?.setVisible(displayReportingEditingLayer)
  }, [displayReportingEditingLayer, GetSelectedReportingVectorLayer])

  useEffect(() => {
    GetEditingReportingVectorSource()?.clear(true)
    GetEditingReportingActionsVectorSource()?.clear(true)
    if (reportingState) {
      GetEditingReportingVectorSource()?.addFeature(
        getEditingReportingZoneFeature(reportingState, Layers.REPORTING_SELECTED.code)
      )
    }
  }, [reportingState])

  return null
}
