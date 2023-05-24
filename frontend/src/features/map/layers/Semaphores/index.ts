import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useDispatch } from 'react-redux'

import { useGetSemaphoresQuery } from '../../../../api/semaphoresAPI'
import { Layers } from '../../../../domain/entities/layers/constants'
import { setOverlayPosition } from '../../../../domain/shared_slices/SemaphoresState'
import { selectSemaphoreOnMap } from '../../../../domain/use_cases/semaphores/selectSemaphoreOnMap'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { semaphoreStyles } from './semaphores.style'
import { getSemaphoreZoneFeature } from './semaphoresGeometryHelpers'

import type { MapChildrenProps } from '../../Map'
import type { Geometry } from 'ol/geom'

export function SemaphoresLayer({ map, mapClickEvent }: MapChildrenProps) {
  const dispatch = useDispatch()
  const { displaySemaphoresLayer } = useAppSelector(state => state.global)
  const { overlayPosition, selectedSemaphoreId } = useAppSelector(state => state.semaphoresState)

  const { data } = useGetSemaphoresQuery()

  const semaphoresPoint = useMemo(
    () => data?.filter(f => !!f.geom).map(f => getSemaphoreZoneFeature(f, Layers.SEMAPHORES.code)),
    [data]
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
        style: semaphoreStyles,
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
        isSelected: feature.getId() === selectedSemaphore,
        overlayPosition: feature.getId() === selectedSemaphore ? overlayPosition : undefined
      })
    })
  }, [overlayPosition, selectedSemaphoreId])

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
    GetVectorLayer()?.setVisible(displaySemaphoresLayer)
  }, [displaySemaphoresLayer, GetVectorLayer])

  useEffect(() => {
    if (mapClickEvent?.feature) {
      const feature = mapClickEvent?.feature
      if (feature.getId()?.toString()?.includes(Layers.SEMAPHORES.code)) {
        const { id } = feature.getProperties()
        dispatch(selectSemaphoreOnMap(id))
        dispatch(setOverlayPosition(undefined))
      }
    }
  }, [dispatch, mapClickEvent])

  return null
}
