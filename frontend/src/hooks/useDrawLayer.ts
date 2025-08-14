import { dottedLayerStyle } from '@features/map/layers/styles/dottedLayer.style'
import { drawStyle, editStyle } from '@features/map/layers/styles/draw.style'
import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '@mtes-mct/monitor-ui'
import {
  getOLTypeAndGeometryFunctionFromInteractionType,
  resetDrawInteractions,
  resetModifyInteractions
} from '@utils/drawFunctions'
import { getFeature } from '@utils/getFeature'
import { useMapContext } from 'context/map/MapContext'
import { convertToGeoJSONGeometryObject } from 'domain/entities/layers'
import { Layers } from 'domain/entities/layers/constants'
import { isEmpty } from 'lodash'
import { GeoJSON } from 'ol/format'
import { Draw, Modify } from 'ol/interaction'
import VectorLayer from 'ol/layer/Vector'
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
  onDrawEnd: (event: DrawEvent) => void
  onModifyEnd: (event: GeoJSONType.Geometry | Geometry) => void
  withConversionToGeoJSONGeometryObject?: boolean
}

export function useDrawLayer({
  geometry,
  interactionType,
  isDrawing,
  layerName,
  onDrawEnd,
  onModifyEnd,
  withConversionToGeoJSONGeometryObject = true
}: UseDrawLayerProps) {
  const { map } = useMapContext()
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
    map.addLayer(vectorLayerRef.current)

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      map.removeLayer(vectorLayerRef.current)
    }
  }, [map])

  useEffect(() => {
    resetModifyInteractions(map)
    vectorSourceRef.current.clear(true)
    drawVectorSourceRef.current.clear(true)

    if (isEmpty(feature) || !isDrawing) {
      return
    }
    vectorSourceRef.current.addFeature(feature)
    const modify = new Modify({
      source: vectorSourceRef.current
    })

    modify.on('modifyend', setGeometryOnModifyEnd)
    map?.addInteraction(modify)

    // eslint-disable-next-line consistent-return
    return () => {
      modify.un('modifyend', setGeometryOnModifyEnd)
      map.removeInteraction(modify)
    }
  }, [map, feature, isDrawing, setGeometryOnModifyEnd])

  useEffect(() => {
    if (!isDrawing || !interactionType) {
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

    const handleDrawEnd = (event: DrawEvent) => {
      onDrawEnd(event)
      event.stopPropagation()
      drawVectorSourceRef.current.clear(true)
    }

    draw.on('drawend', handleDrawEnd)
    map.addInteraction(draw)

    return () => {
      draw.un('drawend', handleDrawEnd)
      map.removeInteraction(draw)
      // eslint-disable-next-line react-hooks/exhaustive-deps
      vectorSourceRef.current.clear(true)
      // eslint-disable-next-line react-hooks/exhaustive-deps
      drawVectorSourceRef.current.clear(true)
    }
    // we don't want to listen onDrawEnd
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, interactionType, isDrawing, onDrawEnd])
}
