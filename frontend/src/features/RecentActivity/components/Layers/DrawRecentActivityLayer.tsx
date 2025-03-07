import { drawStyle } from '@features/map/layers/styles/draw.style'
import { drawFeature } from '@features/RecentActivity/useCases/drawFeature'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { useDrawVectorLayer } from '@hooks/useDrawVectorLayer'
import {
  getOLTypeAndGeometryFunctionFromInteractionType,
  resetDrawInteractions,
  resetModifyInteractions
} from '@utils/drawFunctions'
import { convertToGeoJSONGeometryObject } from 'domain/entities/layers'
import { Layers } from 'domain/entities/layers/constants'
import { isEmpty } from 'lodash'
import { Modify } from 'ol/interaction'
import Draw from 'ol/interaction/Draw'
import React, { useCallback, useEffect } from 'react'

import { recentActivityActions } from '../../slice'

import type { BaseMapChildrenProps } from '@features/map/BaseMap'

function UnmemoizeDrawRecentActivityLayer({ map }: BaseMapChildrenProps) {
  const dispatch = useAppDispatch()
  const geometry = useAppSelector(state => state.recentActivity.geometry)
  const interactionType = useAppSelector(state => state.recentActivity.interactionType)
  const isDrawing = useAppSelector(state => state.recentActivity.isDrawing)

  const { drawVectorSourceRef, feature, vectorLayerRef, vectorSourceRef } = useDrawVectorLayer(
    geometry,
    Layers.DRAW_RECENT_ACTIVITY.code
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
        dispatch(recentActivityActions.setGeometry(convertedGeometry))
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
      dispatch(drawFeature(event.feature))
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

export const DrawRecentActivityLayer = React.memo(UnmemoizeDrawRecentActivityLayer)
