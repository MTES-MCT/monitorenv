import _ from 'lodash'
import GeoJSON from 'ol/format/GeoJSON'
import Draw, { createBox, createRegularPolygon } from 'ol/interaction/Draw'
import Modify from 'ol/interaction/Modify'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import React, { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'

import { drawLayerTypes } from '../../../domain/entities/drawLayer'
import { Layers } from '../../../domain/entities/layers'
import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '../../../domain/entities/map'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { addFeature } from '../../drawLayer/DrawLayer.slice'
import { dottedLayerStyle, pointLayerStyle } from './styles/dottedLayer.style'
import { drawStyle, editStyle } from './styles/draw.style'

import type { Geometry } from 'ol/geom'

export function DrawLayer({ map }) {
  const { features, interactionType } = useAppSelector(state => state.drawLayer)

  const dispatch = useDispatch()
  // vectorSource & vectorLayer are holding current features (for visualisation + edition)
  const vectorSourceRef = useRef() as React.MutableRefObject<VectorSource<Geometry>>
  const GetVectorSource = () => {
    if (vectorSourceRef.current === undefined) {
      vectorSourceRef.current = new VectorSource({
        format: new GeoJSON({
          dataProjection: WSG84_PROJECTION,
          featureProjection: OPENLAYERS_PROJECTION
        })
      })
    }

    return vectorSourceRef.current
  }
  // drawVectorSource & drawVectorLayer are used to draw features, but features are dismissed after being drawned
  const drawVectorSourceRef = useRef() as React.MutableRefObject<VectorSource<Geometry>>

  const GetDrawVectorSource = () => {
    if (drawVectorSourceRef.current === undefined) {
      drawVectorSourceRef.current = new VectorSource({ wrapX: false })
    }

    return drawVectorSourceRef.current
  }

  const vectorLayerRef = useRef() as React.MutableRefObject<VectorLayer<VectorSource> & { name?: string }>
  useEffect(() => {
    const GetVectorLayer = () => {
      if (vectorLayerRef.current === undefined) {
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
      if (interactionType) {
        map.addInteraction(modify)
      }
    }

    return () => {
      if (map) {
        map.removeInteraction(modify)
      }
    }
  }, [features, map, interactionType])

  useEffect(() => {
    if (map && interactionType) {
      let type
      let geomFunction
      switch (interactionType) {
        case drawLayerTypes.SQUARE:
          geomFunction = createBox()
          type = 'Circle'
          break
        case drawLayerTypes.CIRCLE:
          geomFunction = createRegularPolygon()
          type = 'Circle'
          break
        case drawLayerTypes.POLYGON:
          type = 'Polygon'
          break
        case drawLayerTypes.POINT:
        default:
          type = 'Point'
          break
      }

      const draw = new Draw({
        geometryFunction: geomFunction,
        source: GetDrawVectorSource(),
        stopClick: true,
        style: drawStyle,
        type
      })
      map.addInteraction(draw)

      draw.on('drawend', event => {
        dispatch(addFeature(event.feature))
        GetDrawVectorSource()?.clear(true)
        map.removeInteraction(draw)
      })

      return () => {
        if (map) {
          map.removeInteraction(draw)
        }
      }
    }

    return () => {}
  }, [dispatch, map, interactionType])

  return null
}
