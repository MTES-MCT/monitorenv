import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { MutableRefObject, useCallback, useEffect, useRef } from 'react'

import { getReportingZoneFeature } from './reportingsGeometryHelpers'
import { selectedReportingStyleFn } from './style'
import { useGetReportingsQuery } from '../../../../api/reportingsAPI'
import { Layers } from '../../../../domain/entities/layers/constants'
import { useAppSelector } from '../../../../hooks/useAppSelector'

import type { BaseMapChildrenProps } from '../../BaseMap'

export function SelectedReportingLayer({ map }: BaseMapChildrenProps) {
  const { activeReportingId, selectedReportingIdOnMap } = useAppSelector(state => state.multiReportings)
  const { displayReportingSelectedLayer } = useAppSelector(state => state.global)
  const { selectedReporting } = useGetReportingsQuery(undefined, {
    selectFromResult: ({ data }) => ({
      selectedReporting: selectedReportingIdOnMap && data?.entities[selectedReportingIdOnMap]
    })
  })
  const displaySelectedReporting = displayReportingSelectedLayer && selectedReportingIdOnMap !== activeReportingId

  const selectedReportingVectorSourceRef = useRef() as MutableRefObject<VectorSource>
  const GetSelectedReportingVectorSource = () => {
    if (selectedReportingVectorSourceRef.current === undefined) {
      selectedReportingVectorSourceRef.current = new VectorSource()
    }

    return selectedReportingVectorSourceRef.current
  }

  const selectedReportingVectorLayerRef = useRef() as MutableRefObject<VectorLayer<VectorSource> & { name?: string }>

  const GetSelectedReportingVectorLayer = useCallback(() => {
    if (selectedReportingVectorLayerRef.current === undefined) {
      selectedReportingVectorLayerRef.current = new VectorLayer({
        renderBuffer: 7,
        source: GetSelectedReportingVectorSource(),
        style: selectedReportingStyleFn,
        updateWhileAnimating: true,
        updateWhileInteracting: true,
        zIndex: Layers.REPORTING_SELECTED.zIndex
      })
      selectedReportingVectorLayerRef.current.name = Layers.REPORTING_SELECTED.code
    }

    return selectedReportingVectorLayerRef.current
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
    GetSelectedReportingVectorLayer()?.setVisible(displaySelectedReporting)
  }, [displaySelectedReporting, GetSelectedReportingVectorLayer])

  useEffect(() => {
    GetSelectedReportingVectorSource()?.clear(true)
    if (selectedReporting) {
      GetSelectedReportingVectorSource()?.addFeature(
        getReportingZoneFeature(selectedReporting, Layers.REPORTING_SELECTED.code)
      )
    }
  }, [selectedReporting])

  return null
}
