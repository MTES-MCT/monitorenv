import _ from 'lodash'
import GeoJSON from 'ol/format/GeoJSON'
import Draw, { createBox, createRegularPolygon } from 'ol/interaction/Draw'
import Modify from 'ol/interaction/Modify'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { drawLayerTypes } from '../../../domain/entities/drawLayer'
import { Layers } from '../../../domain/entities/layers'
import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '../../../domain/entities/map'
import { addFeature } from '../../drawLayer/DrawLayer.slice'
import { dottedLayerStyle, pointLayerStyle } from './styles/dottedLayer.style'
import { drawStyle, editStyle } from './styles/draw.style'

export function DrawLayer({ map }) {
  const { features, interactionType } = useSelector(state => state.drawLayer)

  const dispatch = useDispatch()
  // vectorSource & vectorLayer are holding current features (for visualisation + edition)
  const vectorSourceRef = useRef(null)
  const GetVectorSource = () => {
    if (vectorSourceRef.current === null) {
      vectorSourceRef.current = new VectorSource({
        format: new GeoJSON({
          dataProjection: WSG84_PROJECTION,
          featureProjection: OPENLAYERS_PROJECTION
        }),
        projection: OPENLAYERS_PROJECTION
      })
    }

    return vectorSourceRef.current
  }
  // drawVectorSource & drawVectorLayer are used to draw features, but features are dismissed after being drawned
  const drawVectorSourceRef = useRef(null)

  const GetDrawVectorSource = () => {
    if (drawVectorSourceRef.current === null) {
      drawVectorSourceRef.current = new VectorSource({ wrapX: false })
    }

    return drawVectorSourceRef.current
  }

  const vectorLayerRef = useRef(null)
  useEffect(() => {
    const GetVectorLayer = () => {
      if (vectorLayerRef.current === null) {
        vectorLayerRef.current = new VectorLayer({
          renderBuffer: 7,
          source: GetVectorSource(),
          style: [pointLayerStyle, dottedLayerStyle, editStyle],
          updateWhileAnimating: true,
          updateWhileInteracting: true,
          zIndex: Layers.DRAW_LAYER.zIndex
        })
        vectorLayerRef.current.name = Layers.DRAW_LAYER.code
      }

      return vectorLayerRef.current
    }

    if (map) {
      map.getLayers().push(GetVectorLayer())
    }

    return () => {
      if (map) {
        map.removeLayer(GetVectorLayer())
      }
    }
  }, [map])

  useEffect(() => {
    if (vectorLayerRef.current !== null) {
      if (interactionType) {
        vectorLayerRef.current.setStyle([pointLayerStyle, dottedLayerStyle, editStyle])
      } else {
        vectorLayerRef.current.setStyle([pointLayerStyle, dottedLayerStyle])
      }
    }
  }, [interactionType])

  useEffect(() => {
    const modify = new Modify({ source: GetVectorSource() })
    GetVectorSource()?.clear(true)
    GetDrawVectorSource()?.clear(true)
    if (!_.isEmpty(features)) {
      GetVectorSource()?.addFeatures(features)
      interactionType && map.addInteraction(modify)
    }

    return () => {
      if (map) {
        map.removeInteraction(modify)
      }
    }
  }, [features, map, interactionType])

  useEffect(() => {
    if (map && interactionType) {
      let type = null
      switch (interactionType) {
        case drawLayerTypes.SQUARE:
        case drawLayerTypes.CIRCLE:
          type = 'Circle'
          break
        case drawLayerTypes.POLYGON:
          type = 'Polygon'
          break
        case drawLayerTypes.POINT:
          type = 'Point'
          break
        default:
          console.error('No interaction type specified')

          return
      }

      const draw = new Draw({
        geometryFunction:
          interactionType === drawLayerTypes.SQUARE
            ? createBox()
            : interactionType === drawLayerTypes.CIRCLE
            ? createRegularPolygon()
            : null,
        source: GetDrawVectorSource(),
        style: drawStyle,
        type
      })
      map.addInteraction(draw)

      draw.on('drawend', event => {
        dispatch(addFeature(event.feature))
        GetDrawVectorSource()?.clear(true)
        map.removeInteraction(draw)
      })

      return () => map.removeInteraction(draw)
    }
  }, [map, interactionType])

  return null
}
