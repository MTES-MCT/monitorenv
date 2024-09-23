import { dottedLayerStyle } from '@features/map/layers/styles/dottedLayer.style'
import { drawStyle, editStyle } from '@features/map/layers/styles/draw.style'
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

import { dashboardActions } from '../slice'

import type { BaseMapChildrenProps } from '@features/map/BaseMap'
import type { VectorLayerWithName } from 'domain/types/layer'
import type Feature from 'ol/Feature'
import type { Geometry } from 'ol/geom'

function UnmemoizeDrawDashboardLayer({ map }: BaseMapChildrenProps) {
  const dispatch = useAppDispatch()
  const geometry = useAppSelector(state => state.dashboard.geometry)
  const interactionType = useAppSelector(state => state.dashboard.interactionType)

  const feature = useMemo(() => {
    if (!geometry) {
      return undefined
    }

    return new GeoJSON({
      featureProjection: OPENLAYERS_PROJECTION
    }).readFeature(geometry)
  }, [geometry])

  const vectorSourceRef = useRef(
    new VectorSource({
      format: new GeoJSON({
        dataProjection: WSG84_PROJECTION,
        featureProjection: OPENLAYERS_PROJECTION
      })
    })
  ) as React.MutableRefObject<VectorSource<Feature<Geometry>>>

  const drawVectorSourceRef = useRef(new VectorSource()) as MutableRefObject<VectorSource<Feature<Geometry>>>

  const vectorLayerRef = useRef(
    new VectorLayer({
      renderBuffer: 7,
      source: vectorSourceRef.current,
      style: [dottedLayerStyle, editStyle],
      updateWhileAnimating: true,
      updateWhileInteracting: true,
      zIndex: Layers.DASHBOARD.zIndex
    })
  ) as React.MutableRefObject<VectorLayerWithName>

  ;(vectorLayerRef.current as VectorLayerWithName).name = Layers.DASHBOARD.code

  useEffect(() => {
    map.getLayers().push(vectorLayerRef.current)

    return () => {
      if (map) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        map.removeLayer(vectorLayerRef.current)
      }
    }
  }, [map])

  const setGeometryOnModifyEnd = useCallback(
    event => {
      const nextGeometry = event.features.item(0).getGeometry()
      if (nextGeometry) {
        const convertedGeometry = convertToGeoJSONGeometryObject(nextGeometry)
        dispatch(dashboardActions.setGeometry(convertedGeometry))
      }
    },
    [dispatch]
  )

  useEffect(() => {
    if (isEmpty(feature)) {
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
  }, [map, feature, setGeometryOnModifyEnd])

  useEffect(() => {
    if (!map) {
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
      dispatch(addFeatureToDrawedFeature(event.feature))
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
  }, [map, dispatch, interactionType])

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

export const DrawDashboardLayer = React.memo(UnmemoizeDrawDashboardLayer)
