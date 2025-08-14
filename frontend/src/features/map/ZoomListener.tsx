import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { useMapContext } from 'context/map/MapContext'
import { removeOverlayStroke } from 'domain/shared_slices/Global'
import { isEmpty } from 'lodash'
import { memo, useEffect } from 'react'
import { useDebouncedCallback } from 'use-debounce'

export const ZoomListener = memo(() => {
  const { map } = useMapContext()

  const dispatch = useAppDispatch()

  const overlayCoordinates = useAppSelector(state => state.global.overlayCoordinates)

  const debouncedHandleChangeResolution = useDebouncedCallback(() => {
    if (!isEmpty(overlayCoordinates)) {
      dispatch(removeOverlayStroke())
    }
  }, 250)

  useEffect(() => {
    if (!map) {
      return
    }

    const view = map.getView()
    view.on('change:resolution', () => {
      debouncedHandleChangeResolution()
    })
  }, [map, debouncedHandleChangeResolution])

  return null
})
