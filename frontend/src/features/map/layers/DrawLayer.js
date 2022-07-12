import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import _ from 'lodash'
import VectorSource from 'ol/source/Vector'
import Draw, { createBox, createRegularPolygon } from 'ol/interaction/Draw'
import Modify from 'ol/interaction/Modify'
import GeoJSON from 'ol/format/GeoJSON'
import VectorLayer from 'ol/layer/Vector'

import Layers from '../../../domain/entities/layers'
import { drawLayerTypes } from '../../../domain/entities/drawLayer'
import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '../../../domain/entities/map'

import { addFeature } from '../../../features/drawLayer/DrawLayer.slice'

import { drawStyle, editStyle } from './styles/draw.style'
import { dottedLayerStyle, pointLayerStyle } from './styles/dottedLayer.style'

export const DrawLayer = ({ map }) => {
  const {interactionType, features} = useSelector(state => state.drawLayer)
  
  const dispatch = useDispatch()
  // vectorSource & vectorLayer are holding current features (for visualisation + edition)
  const vectorSourceRef = useRef(null)
  // drawVectorSource & drawVectorLayer are used to draw features, but features are dismissed after being drawned
  const drawVectorSourceRef = useRef(null)
  const GetDrawVectorSource = () => {
    if (drawVectorSourceRef.current === null) {
      drawVectorSourceRef.current = new VectorSource({ wrapX: false })
    }
    return drawVectorSourceRef.current
  }
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

  const vectorLayerRef = useRef(null)
  

  useEffect(() => {
    const GetVectorLayer = () => {
      if (vectorLayerRef.current === null) {
        vectorLayerRef.current = new VectorLayer({
          source: GetVectorSource(),
          renderBuffer: 7,
          updateWhileAnimating: true,
          updateWhileInteracting: true,
          zIndex: Layers.DRAW_LAYER.zIndex,
          style: [pointLayerStyle, dottedLayerStyle, editStyle]
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
    GetVectorSource()?.clear(true)
    GetDrawVectorSource()?.clear(true)
    const modify = new Modify({source: GetVectorSource()})

    if (!_.isEmpty(features)) {
      map.addInteraction(modify)
      GetVectorSource()?.addFeatures(features)
    }
    return () => {
      if (map) {
        map.removeInteraction(modify)
      }
    }
  }, [features, map])

  useEffect(() => {
    function drawOnMap () {
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
          source: GetDrawVectorSource(),
          type: type,
          style: drawStyle,
          geometryFunction: interactionType === drawLayerTypes.SQUARE ? createBox() : interactionType === drawLayerTypes.CIRCLE ? createRegularPolygon() : null
        })
        map.addInteraction(draw)

        draw.on('drawend', event => {
          dispatch(addFeature(event.feature))
          GetDrawVectorSource()?.clear(true)
          map.removeInteraction(draw)
        })
      }
    }

    drawOnMap()
  }, [map, interactionType])


  return null
}
