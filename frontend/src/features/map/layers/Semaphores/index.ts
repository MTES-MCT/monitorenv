import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useDispatch } from 'react-redux'

import { Layers } from '../../../../domain/entities/layers/constants'
import { selectSemaphoreOnMap } from '../../../../domain/use_cases/semaphores/selectSemaphoreOnMap'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import * as mocks from '../../../Semaphores/SemaphoresOnMap/semaphores.json'
import { semaphoreStyle } from './semaphores.style'
import { getSemaphoreZoneFeature } from './semaphoresGeometryHelpers'

import type { MapChildrenProps } from '../../Map'
import type { Geometry } from 'ol/geom'

export function SemaphoresLayer({ map, mapClickEvent }: MapChildrenProps) {
  const dispatch = useDispatch()
  const { displaySemaphoresLayer } = useAppSelector(state => state.global)

  const semaphoresPoint = useMemo(
    () => mocks.semaphores?.filter(f => !!f.geom).map(f => getSemaphoreZoneFeature(f, Layers.SEMAPHORES.code)),
    []
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
        style: semaphoreStyle,
        updateWhileAnimating: true,
        updateWhileInteracting: true,
        zIndex: Layers.SEMAPHORES.zIndex
      })
      vectorLayerRef.current.name = Layers.SEMAPHORES.code
    }

    return vectorLayerRef.current
  }, [])

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
      }
    }
  }, [dispatch, mapClickEvent])

  return null
}
