import { useMapContext } from 'context/map/MapContext'
import { convertToFeature } from 'domain/types/map'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { memo, useEffect, useRef, type MutableRefObject } from 'react'

import { reportingLinkStyle } from './style'
import { Layers } from '../../../../domain/entities/layers/constants'

import type { VectorLayerWithName } from 'domain/types/layer'
import type { Feature } from 'ol'
import type { Geometry } from 'ol/geom'

export const HoveredSemaphoreLayer = memo(() => {
  const { currentFeatureOver, map } = useMapContext()

  const hoveredSemaphoreVectorSourceRef = useRef(new VectorSource()) as MutableRefObject<
    VectorSource<Feature<Geometry>>
  >
  const hoveredSemaphoreVectorLayerRef = useRef(
    new VectorLayer({
      renderBuffer: 7,
      source: hoveredSemaphoreVectorSourceRef.current,
      style: reportingLinkStyle,
      zIndex: Layers.SEMAPHORES.zIndex
    })
  ) as MutableRefObject<VectorLayerWithName>
  hoveredSemaphoreVectorLayerRef.current.name = Layers.SEMAPHORES.code

  useEffect(() => {
    if (map) {
      map.getLayers().push(hoveredSemaphoreVectorLayerRef.current)

      // eslint-disable-next-line react-hooks/exhaustive-deps
      return () => map.removeLayer(hoveredSemaphoreVectorLayerRef.current)
    }

    return () => {}
  }, [map])

  useEffect(() => {
    hoveredSemaphoreVectorSourceRef.current?.clear(true)
    const feature = convertToFeature(currentFeatureOver)
    if (feature && feature.getId()?.toString()?.includes(Layers.SEMAPHORES.code)) {
      hoveredSemaphoreVectorSourceRef.current?.addFeature(feature)
    }
  }, [currentFeatureOver])

  return null
})
