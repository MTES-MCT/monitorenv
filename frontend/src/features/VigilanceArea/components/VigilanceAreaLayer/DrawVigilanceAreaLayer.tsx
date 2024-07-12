import { dottedLayerStyle } from '@features/map/layers/styles/dottedLayer.style'
import { drawStyle, editStyle } from '@features/map/layers/styles/draw.style'
import { vigilanceAreaActions, VigilanceAreaFormTypeOpen } from '@features/VigilanceArea/slice'
import { addFeatureToDrawedFeature } from '@features/VigilanceArea/useCases/addFeatureToDrawedFeature'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { convertToGeoJSONGeometryObject } from 'domain/entities/layers'
import { Layers } from 'domain/entities/layers/constants'
import { InteractionType, OLGeometryType, OPENLAYERS_PROJECTION, WSG84_PROJECTION } from 'domain/entities/map/constants'
import { isEmpty } from 'lodash'
import GeoJSON from 'ol/format/GeoJSON'
import { Modify } from 'ol/interaction'
import Draw, { createBox, createRegularPolygon, type GeometryFunction } from 'ol/interaction/Draw'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import React, { type MutableRefObject, useCallback, useEffect, useMemo, useRef } from 'react'

import type { BaseMapChildrenProps } from '@features/map/BaseMap'
import type { VectorLayerWithName } from 'domain/types/layer'
import type Feature from 'ol/Feature'
import type { Geometry } from 'ol/geom'

function UnmemoizedDrawVigilanceAreaLayer({ map }: BaseMapChildrenProps) {
  const dispatch = useAppDispatch()
  const geometry = useAppSelector(state => state.vigilanceArea.geometry)
  const interactionType = useAppSelector(state => state.vigilanceArea.interactionType)
  const formTypeOpen = useAppSelector(state => state.vigilanceArea.formTypeOpen)
  const isDrawFormOpen = formTypeOpen === VigilanceAreaFormTypeOpen.DRAW

  const feature = useMemo(() => {
    if (!geometry) {
      return undefined
    }

    return new GeoJSON({
      featureProjection: OPENLAYERS_PROJECTION
    }).readFeature(geometry)
  }, [geometry])

  const vectorSourceRef = useRef() as MutableRefObject<VectorSource<Feature<Geometry>>>
  const getVectorSource = useCallback((): VectorSource<Feature<Geometry>> => {
    if (vectorSourceRef.current === undefined) {
      vectorSourceRef.current = new VectorSource({
        format: new GeoJSON({
          dataProjection: WSG84_PROJECTION,
          featureProjection: OPENLAYERS_PROJECTION
        })
      })
    }

    return vectorSourceRef.current
  }, [])

  const drawVectorSourceRef = useRef() as MutableRefObject<VectorSource<Feature<Geometry>>>

  const getDrawVectorSource = useCallback((): VectorSource<Feature<Geometry>> => {
    if (drawVectorSourceRef.current === undefined) {
      drawVectorSourceRef.current = new VectorSource()
    }

    return drawVectorSourceRef.current
  }, [])

  const vectorLayerRef = useRef() as MutableRefObject<VectorLayerWithName>

  useEffect(() => {
    function getVectorLayer() {
      if (vectorLayerRef.current === undefined) {
        vectorLayerRef.current = new VectorLayer({
          renderBuffer: 7,
          source: getVectorSource(),
          style: [dottedLayerStyle, editStyle],
          updateWhileAnimating: true,
          updateWhileInteracting: true,
          zIndex: Layers.DRAW_VIGILANCE_AREA.zIndex
        })
        vectorLayerRef.current.name = Layers.DRAW_VIGILANCE_AREA.code
      }

      return vectorLayerRef.current
    }

    if (map) {
      map.getLayers().push(getVectorLayer())
    }

    return () => {
      if (map) {
        map.removeLayer(getVectorLayer())
      }
    }
  }, [map, getVectorSource])

  const setGeometryOnModifyEnd = useCallback(
    event => {
      const nextGeometry = event.features.item(0).getGeometry()
      if (nextGeometry) {
        const convertedGeometry = convertToGeoJSONGeometryObject(nextGeometry)
        dispatch(vigilanceAreaActions.setGeometry(convertedGeometry))
      }
    },
    [dispatch]
  )

  useEffect(() => {
    if (isEmpty(feature) || !isDrawFormOpen) {
      return undefined
    }

    resetModifyInteractions(map)
    getVectorSource().clear(true)
    getDrawVectorSource().clear(true)
    getVectorSource().addFeature(feature)
    const modify = new Modify({
      source: getVectorSource()
    })
    map?.addInteraction(modify)

    modify.on('modifyend', setGeometryOnModifyEnd)

    return () => {
      if (map) {
        map.removeInteraction(modify)
        modify.un('modifyend', setGeometryOnModifyEnd)
      }
    }
  }, [getVectorSource, getDrawVectorSource, map, feature, isDrawFormOpen, setGeometryOnModifyEnd])

  useEffect(() => {
    if (!map || !isDrawFormOpen) {
      return undefined
    }

    resetDrawInteractions(map)
    const { geometryFunction, geometryType } = getOLTypeAndGeometryFunctionFromInteractionType(interactionType)

    const draw = new Draw({
      geometryFunction,
      source: getDrawVectorSource(),
      stopClick: true,
      style: drawStyle,
      type: geometryType
    })

    map.addInteraction(draw)

    draw.on('drawend', event => {
      dispatch(addFeatureToDrawedFeature(event.feature))
      event.stopPropagation()
      getDrawVectorSource().clear(true)
    })

    return () => {
      if (map) {
        map.removeInteraction(draw)
        getVectorSource().clear(true)
        getDrawVectorSource().clear(true)
      }
    }
  }, [map, dispatch, getDrawVectorSource, getVectorSource, isDrawFormOpen, interactionType])

  return null
}

function getOLTypeAndGeometryFunctionFromInteractionType(interactionType: InteractionType | null): {
  geometryFunction: GeometryFunction | undefined
  geometryType: OLGeometryType
} {
  switch (interactionType) {
    case InteractionType.SQUARE:
      return {
        geometryFunction: createBox(),
        geometryType: OLGeometryType.CIRCLE
      }
    case InteractionType.CIRCLE:
      return {
        geometryFunction: createRegularPolygon(),
        geometryType: OLGeometryType.CIRCLE
      }
    case InteractionType.POLYGON:
    default:
      return {
        geometryFunction: undefined,
        geometryType: OLGeometryType.POLYGON
      }
  }
}

function resetModifyInteractions(map) {
  map.getInteractions().forEach(interaction => {
    if (interaction instanceof Modify) {
      interaction.setActive(false)
    }
  })
}

function resetDrawInteractions(map) {
  map.getInteractions().forEach(interaction => {
    if (interaction instanceof Draw) {
      interaction.setActive(false)
    }
  })
}

export const DrawVigilanceAreaLayer = React.memo(UnmemoizedDrawVigilanceAreaLayer)
