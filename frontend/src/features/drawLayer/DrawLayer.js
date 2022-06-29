import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import VectorSource from 'ol/source/Vector'
import Draw, { createBox, createRegularPolygon } from 'ol/interaction/Draw'
import Modify from 'ol/interaction/Modify'
import GeoJSON from 'ol/format/GeoJSON'
import VectorLayer from 'ol/layer/Vector'

import { drawLayerTypes } from '../../domain/entities/drawLayer'
import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '../../domain/entities/map'
import { addFeature } from './DrawLayer.slice'

import { drawStyle, editStyle } from '../../layers/styles/draw.style'
import { dottedLayerStyle } from '../../layers/styles/dottedLayer.style'

export const DrawLayer = ({ map }) => {
  const {geometryType, isDrawing, listener, features} = useSelector(state => state.drawLayer)
  
  const dispatch = useDispatch()
  const vectorSourceRef = useRef(null)
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
          zIndex: 999,
          style: [dottedLayerStyle, editStyle]
        })
      }
      return vectorLayerRef.current
    }

    const modify = new Modify({source: GetVectorSource()})

    if (map) {
      map.getLayers().push(GetVectorLayer())
      map.addInteraction(modify)
    }

    return () => {
      if (map) {
        map.removeLayer(GetVectorLayer())
        map.removeInteraction(modify)
      }
    }
  }, [map])

  useEffect(() => {
    GetVectorSource()?.clear(true)
    GetDrawVectorSource()?.clear(true)
    if (features) {
      GetVectorSource()?.addFeatures(features)
    }
  }, [features])

  useEffect(() => {
    function drawOnMap () {
      if (map && isDrawing && geometryType) {

        let type = null
        switch (geometryType) {
          case drawLayerTypes.SQUARE:
          case drawLayerTypes.CIRCLE:
            type = 'Circle'
            break
          case drawLayerTypes.POLYGON:
            type = 'Polygon'
            break
          default:
            console.error('No interaction type specified')
            return
        }

        const draw = new Draw({
          source: GetDrawVectorSource(),
          type: type,
          style: drawStyle,
          geometryFunction: geometryType === drawLayerTypes.SQUARE ? createBox() : geometryType === drawLayerTypes.CIRCLE ? createRegularPolygon() : null
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
  }, [map, geometryType, listener, isDrawing])


  return null
}
