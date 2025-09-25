import { useDrawLayer } from '@hooks/useDrawLayer'
import { Layers } from 'domain/entities/layers/constants'
import { setIsGeometryDrawOnMap } from 'domain/shared_slices/Draw'
import { DrawEvent } from 'ol/interaction/Draw'

import { addFeatureToDrawedFeature } from '../../../domain/use_cases/draw/addFeatureToDrawedFeature'
import { setGeometry } from '../../../domain/use_cases/draw/setGeometry'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'

import type { BaseMapChildrenProps } from '../BaseMap'
import type { GeoJSON as GeoJSONType } from 'domain/types/GeoJSON'
import type Geometry from 'ol/geom/Geometry'

export function DrawLayer({ map }: BaseMapChildrenProps) {
  const dispatch = useAppDispatch()
  const geometry = useAppSelector(state => state.draw.geometry)
  const interactionType = useAppSelector(state => state.draw.interactionType)

  useDrawLayer({
    geometry,
    interactionType,
    isDrawing: !!interactionType,
    layerName: Layers.DRAW.code,
    map,
    onDrawEnd: (event: DrawEvent) => {
      dispatch(setIsGeometryDrawOnMap(true))
      dispatch(addFeatureToDrawedFeature(event.feature))
    },
    onModifyEnd: (geom: GeoJSONType.Geometry | Geometry) => {
      dispatch(setIsGeometryDrawOnMap(true))
      dispatch(setGeometry(geom as Geometry))
    },
    withConversionToGeoJSONGeometryObject: false
  })

  return null
}
