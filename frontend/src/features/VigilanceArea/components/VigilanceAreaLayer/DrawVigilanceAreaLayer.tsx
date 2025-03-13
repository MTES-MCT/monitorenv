import { vigilanceAreaActions, VigilanceAreaFormTypeOpen } from '@features/VigilanceArea/slice'
import { addFeatureToDrawedFeature } from '@features/VigilanceArea/useCases/addFeatureToDrawedFeature'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { useDrawLayer } from '@hooks/useDrawLayer'
import { Layers } from 'domain/entities/layers/constants'
import { DrawEvent } from 'ol/interaction/Draw'
import React from 'react'

import type { BaseMapChildrenProps } from '@features/map/BaseMap'
import type { GeoJSON } from 'domain/types/GeoJSON'
import type { Geometry } from 'ol/geom'

function UnmemoizedDrawVigilanceAreaLayer({ map }: BaseMapChildrenProps) {
  const dispatch = useAppDispatch()
  const geometry = useAppSelector(state => state.vigilanceArea.geometry)
  const interactionType = useAppSelector(state => state.vigilanceArea.interactionType)
  const formTypeOpen = useAppSelector(state => state.vigilanceArea.formTypeOpen)
  const isDrawFormOpen = formTypeOpen === VigilanceAreaFormTypeOpen.DRAW

  useDrawLayer({
    geometry,
    interactionType,
    isDrawing: isDrawFormOpen,
    layerName: Layers.DRAW_VIGILANCE_AREA.code,
    map,
    onDrawEnd: (event: DrawEvent) => {
      dispatch(addFeatureToDrawedFeature(event.feature))
    },
    onModifyEnd: (geom: GeoJSON.Geometry | Geometry) =>
      dispatch(vigilanceAreaActions.setGeometry(geom as GeoJSON.Geometry)),
    withConversionToGeoJSONGeometryObject: false
  })

  return null
}

export const DrawVigilanceAreaLayer = React.memo(UnmemoizedDrawVigilanceAreaLayer)
