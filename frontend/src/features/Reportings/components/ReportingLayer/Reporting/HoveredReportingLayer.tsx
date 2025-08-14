import { useMapContext } from 'context/map/MapContext'
import { convertToFeature } from 'domain/types/map'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { type MutableRefObject, memo, useEffect, useRef } from 'react'

import { hoveredReportingStyleFn } from './style'
import { Layers } from '../../../../../domain/entities/layers/constants'

import type { VectorLayerWithName } from '../../../../../domain/types/layer'

export const HoveredReportingLayer = memo(() => {
  const { currentFeatureOver, map } = useMapContext()

  const vectorSourceRef = useRef(new VectorSource()) as MutableRefObject<VectorSource>

  const vectorLayerRef = useRef(
    new VectorLayer({
      renderBuffer: 7,
      source: vectorSourceRef.current,
      style: hoveredReportingStyleFn,
      zIndex: Layers.REPORTINGS.zIndex
    })
  ) as MutableRefObject<VectorLayerWithName>
  vectorLayerRef.current.name = Layers.REPORTING_SELECTED.code

  useEffect(() => {
    map.getLayers().push(vectorLayerRef.current)

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      map.removeLayer(vectorLayerRef.current)
    }
  }, [map])

  useEffect(() => {
    vectorSourceRef.current?.clear(true)
    const feature = convertToFeature(currentFeatureOver)
    if (feature && feature.getId()?.toString()?.includes(Layers.REPORTINGS.code)) {
      vectorSourceRef.current?.addFeature(feature)
    }
  }, [currentFeatureOver])

  return null
})
