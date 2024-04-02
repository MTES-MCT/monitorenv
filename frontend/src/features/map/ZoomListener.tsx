import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { removeAllOverlayCoordinates } from 'domain/shared_slices/Global'
import { isEmpty } from 'lodash'
import { useEffect } from 'react'
import { useDebouncedCallback } from 'use-debounce'

type ZoomListenerProps = {
  map?: any
}

export function ZoomListener({ map }: ZoomListenerProps) {
  const dispatch = useAppDispatch()

  const overlayCoordinates = useAppSelector(state => state.global.overlayCoordinates)

  const debouncedHandleChangeResolution = useDebouncedCallback(() => {
    if (!isEmpty(overlayCoordinates)) {
      dispatch(removeAllOverlayCoordinates())
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
}
