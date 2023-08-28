import { cloneDeep, reduce } from 'lodash'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useDispatch } from 'react-redux'

import { semaphoresStyleFn } from './semaphores.style'
import { getSemaphoreZoneFeature } from './semaphoresGeometryHelpers'
import { useGetReportingsQuery } from '../../../../api/reportingsAPI'
import { useGetSemaphoresQuery } from '../../../../api/semaphoresAPI'
import { Layers } from '../../../../domain/entities/layers/constants'
import { setOverlayCoordinates } from '../../../../domain/shared_slices/Global'
import { setSelectedSemaphore } from '../../../../domain/shared_slices/SemaphoresSlice'
import { useAppSelector } from '../../../../hooks/useAppSelector'

import type { BaseMapChildrenProps } from '../../BaseMap'
import type { Feature } from 'ol'
import type { Geometry } from 'ol/geom'

export function SemaphoresLayer({ map, mapClickEvent }: BaseMapChildrenProps) {
  const dispatch = useDispatch()
  const { displaySemaphoresLayer } = useAppSelector(state => state.global)
  const { isSemaphoreHighlighted, selectedSemaphoreId } = useAppSelector(state => state.semaphoresSlice)
  const { overlayCoordinates } = useAppSelector(state => state.global)
  const listener = useAppSelector(state => state.draw.listener)

  const { data: semaphores } = useGetSemaphoresQuery()

  const { data: reportings } = useGetReportingsQuery()

  const reportingsBySemaphoreId = useMemo(
    () =>
      reduce(
        reportings?.entities,
        (reportingsBySemaphore, reporting) => {
          const reports = cloneDeep(reportingsBySemaphore)
          if (reporting && reporting.semaphoreId) {
            if (!reports[reporting.semaphoreId]) {
              reports[reporting.semaphoreId] = [reporting]
            } else {
              reports[reporting.semaphoreId].push(reporting)
            }
          }

          return reports
        },
        {} as Record<string, any>
      ),
    [reportings]
  )

  const semaphoresPoint = useMemo(
    () =>
      reduce(
        semaphores?.entities,
        (features, semaphore) => {
          if (semaphore && semaphore.geom) {
            const semaphoreFeature = getSemaphoreZoneFeature(semaphore, Layers.SEMAPHORES.code)
            semaphoreFeature.setProperties({
              reportings: reportingsBySemaphoreId[semaphore.id]
            })
            features.push(semaphoreFeature)
          }

          return features
        },
        [] as Feature[]
      ),
    [semaphores, reportingsBySemaphoreId]
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
        style: semaphoresStyleFn,
        updateWhileAnimating: true,
        updateWhileInteracting: true,
        zIndex: Layers.SEMAPHORES.zIndex
      })
      vectorLayerRef.current.name = Layers.SEMAPHORES.code
    }

    return vectorLayerRef.current
  }, [])

  useEffect(() => {
    GetVectorSource().forEachFeature(feature => {
      const selectedSemaphore = `${Layers.SEMAPHORES.code}:${selectedSemaphoreId}`
      feature.setProperties({
        isHighlighted: feature.getId() === selectedSemaphore && isSemaphoreHighlighted,
        isSelected: feature.getId() === selectedSemaphore,
        overlayCoordinates: feature.getId() === selectedSemaphore ? overlayCoordinates : undefined
      })
    })
  }, [overlayCoordinates, selectedSemaphoreId, isSemaphoreHighlighted])

  useEffect(() => {
    if (map) {
      map.getLayers().push(GetVectorLayer())

      return () => map.removeLayer(GetVectorLayer())
    }

    return () => {}
  }, [map, GetVectorLayer])

  useEffect(() => {
    GetVectorSource()?.clear(true)
    if (semaphoresPoint) {
      GetVectorSource()?.addFeatures(semaphoresPoint)
    }
  }, [semaphoresPoint])

  useEffect(() => {
    // we don't want to display semaphores on the map if the user so decides (displaySemaphoresLayer variable)
    // or if user edits a zone or a point (listener variable)
    GetVectorLayer()?.setVisible(displaySemaphoresLayer && !listener)
  }, [displaySemaphoresLayer, GetVectorLayer, listener])

  useEffect(() => {
    if (mapClickEvent?.feature) {
      const feature = mapClickEvent?.feature
      if (feature.getId()?.toString()?.includes(Layers.SEMAPHORES.code)) {
        const { id } = feature.getProperties()
        dispatch(setSelectedSemaphore(id))
        dispatch(setOverlayCoordinates(undefined))
      }
    }
  }, [dispatch, mapClickEvent])

  return null
}
