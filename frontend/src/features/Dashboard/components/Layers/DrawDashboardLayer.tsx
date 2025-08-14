import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { useDrawLayer } from '@hooks/useDrawLayer'
import { Layers } from 'domain/entities/layers/constants'
import { drawFeature } from 'domain/use_cases/draw/drawFeature'
import { DrawEvent } from 'ol/interaction/Draw'
import { memo, useCallback } from 'react'

import { dashboardActions } from '../../slice'

import type { GeoJSON } from 'domain/types/GeoJSON'
import type { Geometry } from 'ol/geom'

export const DrawDashboardLayer = memo(() => {
  const dispatch = useAppDispatch()
  const geometry = useAppSelector(state => state.dashboard.geometry)
  const interactionType = useAppSelector(state => state.dashboard.interactionType)
  const isDrawing = useAppSelector(state => state.dashboard.isDrawing)

  useDrawLayer({
    geometry,
    interactionType,
    isDrawing,
    layerName: Layers.DRAW_DASHBOARD.code,
    onDrawEnd: useCallback(
      (event: DrawEvent) => {
        dispatch(
          drawFeature(
            event.feature,
            geom => dispatch(dashboardActions.setGeometry(geom)),
            state => state.dashboard.geometry
          )
        )
      },
      [dispatch]
    ),
    onModifyEnd: useCallback(
      (geom: GeoJSON.Geometry | Geometry) => dispatch(dashboardActions.setGeometry(geom as GeoJSON.Geometry)),
      [dispatch]
    )
  })

  return null
})
