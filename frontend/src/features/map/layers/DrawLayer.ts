import { useDrawLayer } from '@hooks/useDrawLayer'
import { Layers } from 'domain/entities/layers/constants'
import { DrawEvent } from 'ol/interaction/Draw'
import React from 'react'

import { addFeatureToDrawedFeature } from '../../../domain/use_cases/draw/addFeatureToDrawedFeature'
import { setGeometry } from '../../../domain/use_cases/draw/setGeometry'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'

import type { BaseMapChildrenProps } from '../BaseMap'
import type { GeoJSON as GeoJSONType } from 'domain/types/GeoJSON'
import type Geometry from 'ol/geom/Geometry'

function UnmemoizedDrawLayer({ map }: BaseMapChildrenProps) {
  const dispatch = useAppDispatch()
  const geometry = useAppSelector(state => state.draw.geometry)
  const interactionType = useAppSelector(state => state.draw.interactionType)

  useDrawLayer({
    geometry,
    interactionType,
    isDrawing: !!interactionType,
    layerName: Layers.DRAW_DASHBOARD.code,
    map,
    onDrawEnd: (event: DrawEvent) => {
      dispatch(addFeatureToDrawedFeature(event.feature))
    },
    onModifyEnd: (geom: GeoJSONType.Geometry | Geometry) => dispatch(setGeometry(geom as Geometry)),
    withConversionToGeoJSONGeometryObject: false
  })

  return null
}

export const DrawLayer = React.memo(UnmemoizedDrawLayer)
