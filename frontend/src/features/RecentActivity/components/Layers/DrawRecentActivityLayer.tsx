import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { useDrawLayer } from '@hooks/useDrawLayer'
import { Layers } from 'domain/entities/layers/constants'
import { drawFeature } from 'domain/use_cases/draw/drawFeature'
import { DrawEvent } from 'ol/interaction/Draw'

import { recentActivityActions } from '../../slice'

import type { BaseMapChildrenProps } from '@features/map/BaseMap'
import type { GeoJSON } from 'domain/types/GeoJSON'
import type { Geometry } from 'ol/geom'

export function DrawRecentActivityLayer({ map }: BaseMapChildrenProps) {
  const dispatch = useAppDispatch()
  const geometry = useAppSelector(state => state.recentActivity.drawedGeometry)
  const interactionType = useAppSelector(state => state.recentActivity.interactionType)
  const isDrawing = useAppSelector(state => state.recentActivity.isDrawing)

  useDrawLayer({
    geometry,
    interactionType,
    isDrawing,
    layerName: Layers.DRAW_RECENT_ACTIVITY.code,
    map,
    onDrawEnd: (event: DrawEvent) => {
      dispatch(
        drawFeature(
          event.feature,
          geom => dispatch(recentActivityActions.setGeometry(geom as GeoJSON.MultiPolygon)),
          state => state.recentActivity.drawedGeometry
        )
      )
    },
    onModifyEnd: (geom: GeoJSON.Geometry | Geometry) =>
      dispatch(recentActivityActions.setGeometry(geom as GeoJSON.MultiPolygon))
  })

  return null
}
