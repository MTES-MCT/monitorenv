import { vigilanceAreaActions, VigilanceAreaFormTypeOpen } from '@features/VigilanceArea/slice'
import { addFeatureToDrawedFeature } from '@features/VigilanceArea/useCases/addFeatureToDrawedFeature'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { useDrawLayer } from '@hooks/useDrawLayer'
import { Layers } from 'domain/entities/layers/constants'
import { DrawEvent } from 'ol/interaction/Draw'
import { memo, useCallback } from 'react'

import type { GeoJSON } from 'domain/types/GeoJSON'
import type { Geometry } from 'ol/geom'

export const DrawVigilanceAreaLayer = memo(() => {
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
    onDrawEnd: useCallback(
      (event: DrawEvent) => {
        dispatch(addFeatureToDrawedFeature(event.feature))
      },
      [dispatch]
    ),
    onModifyEnd: useCallback(
      (geom: GeoJSON.Geometry | Geometry) => dispatch(vigilanceAreaActions.setGeometry(geom as GeoJSON.Geometry)),
      [dispatch]
    )
  })

  return null
})
