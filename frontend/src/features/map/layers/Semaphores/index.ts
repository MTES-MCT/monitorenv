import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useDispatch } from 'react-redux'

import { semaphoreStyles } from './semaphores.style'
import { getSemaphoreZoneFeature } from './semaphoresGeometryHelpers'
import { useGetSemaphoresQuery } from '../../../../api/semaphoresAPI'
import { Layers } from '../../../../domain/entities/layers/constants'
import { setOverlayCoordinates } from '../../../../domain/shared_slices/Global'
import { setSelectedSemaphore } from '../../../../domain/shared_slices/SemaphoresSlice'
import { useAppSelector } from '../../../../hooks/useAppSelector'

import type { MapChildrenProps } from '../../Map'
import type { Geometry } from 'ol/geom'

export function SemaphoresLayer({ map, mapClickEvent }: MapChildrenProps) {
  const dispatch = useDispatch()
  const { displaySemaphoresLayer } = useAppSelector(state => state.global)
  const { selectedSemaphoreId } = useAppSelector(state => state.semaphoresSlice)
  const { overlayCoordinates } = useAppSelector(state => state.global)
  const listener = useAppSelector(state => state.draw.listener)

  const { data: semaphores } = useGetSemaphoresQuery()

  const semaphoresPoint = useMemo(
    () => semaphores?.filter(f => !!f.geom).map(f => getSemaphoreZoneFeature(f, Layers.SEMAPHORES.code)),
    [semaphores]
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
        overlayCoordinates: feature.getId() === selectedSemaphore ? overlayCoordinates : undefined
      })
    })
  }, [overlayCoordinates, selectedSemaphoreId])

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
    // or if user edits a surveillance zone or a control point (listener variable)
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
