import { drawStyle } from '@features/map/layers/styles/draw.style'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { useDrawVectorLayer } from '@hooks/useDrawVectorLayer'
import { convertToGeoJSONGeometryObject } from 'domain/entities/layers'
import { InteractionType, OLGeometryType } from 'domain/entities/map/constants'
import { drawFeature } from 'domain/use_cases/draw/drawFeature'
import { isEmpty } from 'lodash'
import { Modify } from 'ol/interaction'
import Draw, { createBox, createRegularPolygon, type GeometryFunction } from 'ol/interaction/Draw'
import React, { useCallback, useEffect } from 'react'

import { dashboardActions } from '../../slice'

import type { BaseMapChildrenProps } from '@features/map/BaseMap'

function UnmemoizeDrawDashboardLayer({ map }: BaseMapChildrenProps) {
  const dispatch = useAppDispatch()
  const geometry = useAppSelector(state => state.dashboard.geometry)
  const interactionType = useAppSelector(state => state.dashboard.interactionType)
  const isDrawing = useAppSelector(state => state.dashboard.isDrawing)

  const { drawVectorSourceRef, feature, vectorLayerRef, vectorSourceRef } = useDrawVectorLayer(
    geometry,
    'DRAW_DASHBOARD'
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
  }, [map, feature, setGeometryOnModifyEnd, isDrawing, vectorSourceRef, drawVectorSourceRef])

  useEffect(() => {
    if (!map || !isDrawing) {
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
      dispatch(
        drawFeature(
          event.feature,
          geom => dispatch(dashboardActions.setGeometry(geom)),
          state => state.dashboard.geometry
        )
      )
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
  }, [map, dispatch, interactionType, isDrawing, drawVectorSourceRef, vectorSourceRef])

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
