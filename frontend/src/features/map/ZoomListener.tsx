import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { removeOverlayStroke } from 'domain/shared_slices/Global'
import { isEmpty } from 'lodash'
import { useEffect } from 'react'
import { useDebouncedCallback } from 'use-debounce'

import type { BaseMapChildrenProps } from './BaseMap'

export function ZoomListener({ map }: BaseMapChildrenProps) {
  const dispatch = useAppDispatch()

  const overlayCoordinates = useAppSelector(state => state.global.overlayCoordinates)

  const debouncedHandleChangeResolution = useDebouncedCallback(() => {
    if (!isEmpty(overlayCoordinates)) {
      dispatch(removeOverlayStroke())
    }
  }, 250)

  useEffect(() => {
    if (!map) {
      return () => {}
    }

    const view = map.getView()
    view.on('change:resolution', () => {
      debouncedHandleChangeResolution()
    })

    return () => {
      view.un('change:resolution', () => {
        debouncedHandleChangeResolution()
      })
    }
  }, [map, debouncedHandleChangeResolution])

  return null
}
