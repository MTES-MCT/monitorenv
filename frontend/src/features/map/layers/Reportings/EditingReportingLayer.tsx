import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { type MutableRefObject, useCallback, useEffect, useRef, useMemo } from 'react'

import { getEditingReportingZoneFeature } from './reportingsGeometryHelpers'
import { editingReportingStyleFn } from './style'
import { Layers } from '../../../../domain/entities/layers/constants'
import { useAppSelector } from '../../../../hooks/useAppSelector'

import type { VectorLayerWithName } from '../../../../domain/types/layer'
import type { BaseMapChildrenProps } from '../../BaseMap'

export function EditingReportingLayer({ map }: BaseMapChildrenProps) {
  const {
    activeReportingId,
    reportings = { reporting: {} },
    selectedReportingIdOnMap
  } = useAppSelector(state => state.reporting)
  const displayReportingEditingLayer = useAppSelector(state => state.global.displayReportingEditingLayer)
  const overlayCoordinates = useAppSelector(state => state.global.overlayCoordinates)

  const editingReporting = activeReportingId ? reportings[activeReportingId].reporting : undefined
  const listener = useAppSelector(state => state.draw.listener)
  const attachReportingListener = useAppSelector(state => state.attachReportingToMission.attachReportingListener)

  // we don't want to display reportings on the map if the user so decides (displayMissionEditingLayer variable)
  // or if user have interaction on map (edit mission zone, attach reporting to mission)
  const isLayerVisible = useMemo(
    () =>
      displayReportingEditingLayer &&
      !listener &&
      !attachReportingListener &&
      selectedReportingIdOnMap === activeReportingId,
    [displayReportingEditingLayer, listener, attachReportingListener, activeReportingId, selectedReportingIdOnMap]
  )
  const editingReportingVectorSourceRef = useRef() as MutableRefObject<VectorSource>
  const GetEditingReportingVectorSource = () => {
    if (editingReportingVectorSourceRef.current === undefined) {
      editingReportingVectorSourceRef.current = new VectorSource()
    }

    return editingReportingVectorSourceRef.current
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
    const feature = GetEditingReportingVectorSource().getFeatureById(
      `${Layers.REPORTING_SELECTED.code}:${activeReportingId}`
    )

    feature?.setProperties({
      overlayCoordinates: overlayCoordinates.reportings
    })
  }, [overlayCoordinates, activeReportingId])

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
    GetSelectedReportingVectorLayer()?.setVisible(isLayerVisible)
  }, [isLayerVisible, GetSelectedReportingVectorLayer])

  useEffect(() => {
    GetEditingReportingVectorSource()?.clear(true)
    if (editingReporting) {
      GetEditingReportingVectorSource()?.addFeature(
        getEditingReportingZoneFeature(editingReporting, Layers.REPORTING_SELECTED.code)
      )
    }
  }, [editingReporting])

  return null
}
