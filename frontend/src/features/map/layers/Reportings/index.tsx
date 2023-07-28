import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useDispatch } from 'react-redux'

import { getReportingZoneFeature } from './reportingsGeometryHelpers'
import { reportingStyles } from './style'
import { useGetReportingsQuery } from '../../../../api/reportingsAPI'
import { Layers } from '../../../../domain/entities/layers/constants'
import { reportingStateActions } from '../../../../domain/shared_slices/ReportingState'
import { useAppSelector } from '../../../../hooks/useAppSelector'

import type { MapChildrenProps } from '../../Map'
import type { Geometry } from 'ol/geom'

export function ReportingsLayer({ map, mapClickEvent }: MapChildrenProps) {
  const dispatch = useDispatch()
  const { displayReportingsLayer } = useAppSelector(state => state.global)
  const { selectedReportingId } = useAppSelector(state => state.reportingState)
  const { overlayCoordinates } = useAppSelector(state => state.global)
  const listener = useAppSelector(state => state.draw.listener)

  const { data: reportings } = useGetReportingsQuery()

  const reportingsPointOrZone = useMemo(
    () => reportings?.filter(f => !!f.geom).map(f => getReportingZoneFeature(f, Layers.REPORTINGS.code)),
    [reportings]
  )
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
        style: reportingStyles,
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
      const selectedReporting = `${Layers.REPORTINGS.code}:${selectedReportingId}`
      feature.setProperties({
        isSelected: feature.getId() === selectedReporting,
        overlayCoordinates: feature.getId() === selectedReporting ? overlayCoordinates : undefined
      })
    })
  }, [overlayCoordinates, selectedReportingId])

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
    GetVectorLayer()?.setVisible(displayReportingsLayer)
  }, [displayReportingsLayer, GetVectorLayer, listener])

  useEffect(() => {
    if (mapClickEvent?.feature) {
      const feature = mapClickEvent?.feature
      if (feature.getId()?.toString()?.includes(Layers.REPORTINGS.code)) {
        const { id } = feature.getProperties()
        dispatch(reportingStateActions.setSelectedReportingId(id))
      }
    }
  }, [dispatch, mapClickEvent])

  return null
}
