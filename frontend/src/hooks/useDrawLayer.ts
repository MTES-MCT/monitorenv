import { dottedLayerStyle } from '@features/map/layers/styles/dottedLayer.style'
import { drawStyle, editStyle } from '@features/map/layers/styles/draw.style'
import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '@mtes-mct/monitor-ui'
import {
  getOLTypeAndGeometryFunctionFromInteractionType,
  resetDrawInteractions,
  resetModifyInteractions
} from '@utils/drawFunctions'
import { getFeature } from '@utils/getFeature'
import { convertToGeoJSONGeometryObject } from 'domain/entities/layers'
import { Layers } from 'domain/entities/layers/constants'
import { isEmpty } from 'lodash'
import { GeoJSON } from 'ol/format'
import { Draw, Modify } from 'ol/interaction'
import VectorLayer from 'ol/layer/Vector'
import OpenLayerMap from 'ol/Map'
import VectorSource from 'ol/source/Vector'
import { useCallback, useEffect, useMemo, useRef, type MutableRefObject } from 'react'

import type { GeoJSON as GeoJSONType } from '../domain/types/GeoJSON'
import type { InteractionType } from 'domain/entities/map/constants'
import type { Feature } from 'ol'
import type { Geometry } from 'ol/geom'
import type { DrawEvent } from 'ol/interaction/Draw'

type VectorLayerWithName = VectorLayer & { name?: string }

type UseDrawLayerProps = {
  geometry: GeoJSONType.Geometry | undefined
  interactionType: InteractionType | undefined
  isDrawing: boolean
  layerName: string
  map: OpenLayerMap
  onDrawEnd: (event: DrawEvent) => void
  onModifyEnd: (event: GeoJSONType.Geometry | Geometry) => void
  withConversionToGeoJSONGeometryObject?: boolean
}

export function useDrawLayer({
  geometry,
  interactionType,
  isDrawing,
  layerName,
  map,
  onDrawEnd,
  onModifyEnd,
  withConversionToGeoJSONGeometryObject = true
}: UseDrawLayerProps) {
  // Memoize the feature creation
  const feature = useMemo(() => getFeature(geometry), [geometry])

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
    })
  ) as MutableRefObject<VectorLayerWithName>
  // Set the name for the vector layer
  vectorLayerRef.current.name = Layers[layerName].code

  const setGeometryOnModifyEnd = useCallback(
    event => {
      const nextGeometry = event.features.item(0).getGeometry()
      if (!nextGeometry) {
        return
      }
      if (withConversionToGeoJSONGeometryObject) {
        const convertedGeometry = convertToGeoJSONGeometryObject(nextGeometry)
        onModifyEnd(convertedGeometry)
      } else {
        onModifyEnd(nextGeometry as Geometry)
      }
    },
    [onModifyEnd, withConversionToGeoJSONGeometryObject]
  )

  useEffect(() => {
    map.getLayers().push(vectorLayerRef.current)

    return () => {
      if (map) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        map.removeLayer(vectorLayerRef.current)
      }
    }
  }, [map, vectorLayerRef])

  useEffect(() => {
    if (isEmpty(feature) || !isDrawing) {
      return undefined
    }

    resetModifyInteractions(map)
    vectorSourceRef.current.clear(true)
    drawVectorSourceRef.current.clear(true)
    vectorSourceRef.current.addFeature(feature)
    const modify = new Modify({
      source: vectorSourceRef.current
    })
    map?.addInteraction(modify)

    modify.on('modifyend', setGeometryOnModifyEnd)

    return () => {
      if (map) {
        map.removeInteraction(modify)
        modify.un('modifyend', setGeometryOnModifyEnd)
      }
    }
    // we don't want to listen onModifyEnd to avoid re-render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, feature, isDrawing, vectorSourceRef, drawVectorSourceRef])

  useEffect(() => {
    if (!map || !isDrawing || !interactionType) {
      return undefined
    }

    resetDrawInteractions(map)
    const { geometryFunction, geometryType } = getOLTypeAndGeometryFunctionFromInteractionType(interactionType)

    const draw = new Draw({
      geometryFunction,
      source: drawVectorSourceRef.current,
      stopClick: true,
      style: drawStyle,
      type: geometryType
    })

    map.addInteraction(draw)

    draw.on('drawend', event => {
      onDrawEnd(event)
      event.stopPropagation()
      drawVectorSourceRef.current.clear(true)
    })

    return () => {
      if (map) {
        map.removeInteraction(draw)
        // eslint-disable-next-line react-hooks/exhaustive-deps
        vectorSourceRef.current.clear(true)
        // eslint-disable-next-line react-hooks/exhaustive-deps
        drawVectorSourceRef.current.clear(true)
      }
    }
    // we don't want to listen onDrawEnd
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, interactionType, isDrawing, drawVectorSourceRef, vectorSourceRef])
}
