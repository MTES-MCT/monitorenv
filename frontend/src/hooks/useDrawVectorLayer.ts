import { dottedLayerStyle } from '@features/map/layers/styles/dottedLayer.style'
import { editStyle } from '@features/map/layers/styles/draw.style'
import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '@mtes-mct/monitor-ui'
import { getFeature } from '@utils/getFeature'
import { Layers } from 'domain/entities/layers/constants'
import { GeoJSON } from 'ol/format'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { useMemo, useRef } from 'react'

import type { Feature } from 'ol'
import type { Geometry } from 'ol/geom'

type VectorLayerWithName = VectorLayer & { name?: string }

export function useDrawVectorLayer(geometry: any, layerName: string) {
  // Memoize the feature creation
  const feature = useMemo(() => {
    if (!geometry) {
      return undefined
    }

    return getFeature(geometry)
  }, [geometry])

  // Create the vector sources and layer references
  const vectorSourceRef = useRef(
    new VectorSource<Feature<Geometry>>({
      format: new GeoJSON({
        dataProjection: WSG84_PROJECTION,
        featureProjection: OPENLAYERS_PROJECTION
      })
    })
  )

  const drawVectorSourceRef = useRef(new VectorSource<Feature<Geometry>>())

  const vectorLayerRef = useRef(
    new VectorLayer({
      renderBuffer: 7,
      source: vectorSourceRef.current,
      style: [dottedLayerStyle, editStyle],
      zIndex: Layers[layerName].zIndex
    }) as VectorLayerWithName
  )

  // Set the name for the vector layer
  vectorLayerRef.current.name = Layers[layerName].code

  return { drawVectorSourceRef, feature, vectorLayerRef, vectorSourceRef }
}
