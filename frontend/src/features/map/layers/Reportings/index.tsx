import { reduce } from 'lodash'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useDispatch } from 'react-redux'

import { getReportingZoneFeature } from './reportingsGeometryHelpers'
import { reportingPinStyleFn } from './style'
import { Layers } from '../../../../domain/entities/layers/constants'
import { multiReportingsActions } from '../../../../domain/shared_slices/MultiReportings'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { useGetFilteredReportingsQuery } from '../../../Reportings/hooks/useGetFilteredReportingsQuery'

import type { BaseMapChildrenProps } from '../../BaseMap'
import type { Feature } from 'ol'
import type { Geometry } from 'ol/geom'

export function ReportingsLayer({ map, mapClickEvent }: BaseMapChildrenProps) {
  const dispatch = useDispatch()
  const { displayReportingsLayer, overlayCoordinates } = useAppSelector(state => state.global)
  const { selectedReportingId } = useAppSelector(state => state.multiReportings)
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
        dispatch(multiReportingsActions.setSelectedReportingIdOnMap(id))
      }
    }
  }, [dispatch, mapClickEvent])

  return null
}
