import { useAppDispatch } from '@hooks/useAppDispatch'
import { useMoveOverlayWhenDragging } from '@hooks/useMoveOverlayWhenDragging'
import { setOverlayCoordinates } from 'domain/shared_slices/Global'
import Overlay from 'ol/Overlay'
import { useCallback, useEffect, useRef, useState } from 'react'

import type OpenLayerMap from 'ol/Map'

const INITIAL_OFFSET_VALUE = [0, 0]
const X_MARGIN = 180

type OverlayPositionOnCoordinatesProps = {
  children: React.ReactNode
  coordinates: number[] | undefined
  layerOverlayIsOpen: boolean
  map: OpenLayerMap
  name: string
}
export function OverlayPositionOnCoordinates({
  children,
  coordinates,
  layerOverlayIsOpen,
  map,
  name
}: OverlayPositionOnCoordinatesProps) {
  const dispatch = useAppDispatch()

  const containerRef = useRef<HTMLDivElement | null>(null)
  const olOverlayRef = useRef<Overlay | null>(null)

  const isThrottled = useRef(false)
  const [isMounted, setIsMounted] = useState(false)

  const currentOffset = useRef<number[]>(INITIAL_OFFSET_VALUE)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const attachContentToOverlay = useCallback(
    (ref: HTMLDivElement) => {
      if (olOverlayRef.current && map) {
        map.removeOverlay(olOverlayRef.current)
      }
      containerRef.current = ref
      if (ref) {
        olOverlayRef.current = new Overlay({
          className: `ol-overlay-container ol-selectable layer-overlay`,
          element: ref,
          offset: currentOffset.current
        })
        if (map) {
          map.addOverlay(olOverlayRef.current)
        }
      } else {
        olOverlayRef.current = null
      }
    },
    [map]
  )

  const moveLineWithThrottle = useCallback(
    (target, delay) => {
      if (isThrottled.current && !coordinates) {
        return
      }
      isThrottled.current = true
      window.setTimeout(() => {
        if (coordinates) {
          const offset = target.getOffset()
          const pixel = map.getPixelFromCoordinate(coordinates)

          const { width } = target.getElement().getBoundingClientRect()

          const nextXPixelCenter = pixel[0] + offset[0] + X_MARGIN + width / 2
          const nextYPixelCenter = pixel[1] + offset[1]

          const nextCoordinates = map.getCoordinateFromPixel([nextXPixelCenter, nextYPixelCenter])

          dispatch(setOverlayCoordinates({ coordinates: nextCoordinates, name }))

          isThrottled.current = false
        }
      }, delay)
    },
    [dispatch, map, coordinates, name]
  )

  useEffect(() => {
    if (olOverlayRef.current) {
      currentOffset.current = INITIAL_OFFSET_VALUE
      olOverlayRef.current.setOffset(INITIAL_OFFSET_VALUE)
    }
    if (containerRef.current) {
      if (layerOverlayIsOpen) {
        containerRef.current.style.display = 'block'
        olOverlayRef.current?.setPosition(coordinates)
      } else {
        containerRef.current.style.display = 'none'
      }
    }
  }, [layerOverlayIsOpen, coordinates])

  useMoveOverlayWhenDragging({
    currentOffset,
    map,
    moveLineWithThrottle,
    overlay: olOverlayRef.current,
    showed: isMounted
  })

  return <div ref={attachContentToOverlay}>{layerOverlayIsOpen && children}</div>
}
