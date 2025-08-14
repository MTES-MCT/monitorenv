import { useDrawLayer } from '@hooks/useDrawLayer'
import { Layers } from 'domain/entities/layers/constants'
import { DrawEvent } from 'ol/interaction/Draw'
import { memo, useCallback } from 'react'

import { addFeatureToDrawedFeature } from '../../../domain/use_cases/draw/addFeatureToDrawedFeature'
import { setGeometry } from '../../../domain/use_cases/draw/setGeometry'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'

import type { GeoJSON as GeoJSONType } from 'domain/types/GeoJSON'
import type Geometry from 'ol/geom/Geometry'

export const DrawLayer = memo(() => {
  const dispatch = useAppDispatch()
  const geometry = useAppSelector(state => state.draw.geometry)
  const interactionType = useAppSelector(state => state.draw.interactionType)

  useDrawLayer({
    geometry,
    interactionType,
    isDrawing: !!interactionType,
    layerName: Layers.DRAW_DASHBOARD.code,
    onDrawEnd: useCallback(
      (event: DrawEvent) => {
        dispatch(addFeatureToDrawedFeature(event.feature))
      },
      [dispatch]
    ),
    onModifyEnd: useCallback(
      (geom: GeoJSONType.Geometry | Geometry) => {
        dispatch(setGeometry(geom as Geometry))
      },
      [dispatch]
    ),
    withConversionToGeoJSONGeometryObject: false
  })

  return null
})
