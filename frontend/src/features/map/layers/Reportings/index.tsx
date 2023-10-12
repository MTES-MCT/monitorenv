import { reduce } from 'lodash'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { useCallback, useEffect, useMemo, useRef } from 'react'

import { getReportingZoneFeature } from './reportingsGeometryHelpers'
import { reportingPinStyleFn } from './style'
import { Layers } from '../../../../domain/entities/layers/constants'
import { reportingActions } from '../../../../domain/shared_slices/reporting'
import { useAppDispatch } from '../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { useGetFilteredReportingsQuery } from '../../../Reportings/hooks/useGetFilteredReportingsQuery'

import type { BaseMapChildrenProps } from '../../BaseMap'
import type { Feature } from 'ol'
import type { Geometry } from 'ol/geom'

export function ReportingsLayer({ map, mapClickEvent }: BaseMapChildrenProps) {
  const dispatch = useAppDispatch()
  const { displayReportingsLayer, overlayCoordinates } = useAppSelector(state => state.global)
  const activeReportingId = useAppSelector(state => state.reporting.activeReportingId)
  const listener = useAppSelector(state => state.draw.listener)

  const { reportings } = useGetFilteredReportingsQuery()

  const reportingsPointOrZone = useMemo(
    () =>
      reduce(
        reportings,
        (features, reporting) => {
          if (reporting && reporting.geom) {
            features.push(getReportingZoneFeature(reporting, Layers.REPORTINGS.code))
          }

          return features
        },
        [] as Feature[]
      ),
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
        style: reportingPinStyleFn,
        updateWhileAnimating: true,
        updateWhileInteracting: true,
        zIndex: Layers.REPORTING_SELECTED.zIndex
      })
      vectorLayerRef.current.name = Layers.REPORTINGS.code
    }

    return vectorLayerRef.current
  }, [])

  useEffect(() => {
    GetVectorSource().forEachFeature(feature => {
      const selectedReporting = `${Layers.REPORTINGS.code}:${activeReportingId}`
      feature.setProperties({
        isSelected: feature.getId() === selectedReporting,
        overlayCoordinates: feature.getId() === selectedReporting ? overlayCoordinates : undefined
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
    GetVectorLayer()?.setVisible(displayReportingsLayer)
  }, [displayReportingsLayer, GetVectorLayer, listener])

  useEffect(() => {
    if (mapClickEvent?.feature) {
      const feature = mapClickEvent?.feature
      if (feature.getId()?.toString()?.includes(Layers.REPORTINGS.code)) {
        const { id } = feature.getProperties()
        dispatch(reportingActions.setSelectedReportingIdOnMap(id))
      }
    }
  }, [dispatch, mapClickEvent])

  return null
}
