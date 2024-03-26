// @ts-nocheck
import { debounce } from 'lodash'
import { getCenter } from 'ol/extent'
import Overlay from 'ol/Overlay'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { getOverlayPositionForCentroid, getTopLeftMargin } from './position'
import { removeAllOverlayCoordinates, setOverlayCoordinatesByName } from '../../../domain/shared_slices/Global'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { useMoveOverlayWhenDragging } from '../../../hooks/useMoveOverlayWhenDragging'

import type { Feature } from 'ol'
import type { Geometry } from 'ol/geom'

const OVERLAY_HEIGHT = 174

const INITIAL_OFFSET_VALUE = [-90, 10]
const defaultMargins = {
  xLeft: 50,
  xMiddle: 30,
  xRight: -155,
  yBottom: 50,
  yMiddle: 100,
  yTop: -180
}

type OverlayPositionOnCentroidProps = {
  appClassName: string
  children: React.ReactNode
  feature: Feature<Geometry> | null | undefined
  featureIsShowed?: boolean
  map: any
  options?: {
    margins?: {
      xLeft: number
      xMiddle: number
      xRight: number
      yBottom: number
      yMiddle: number
      yTop: number
    }
  }
  zIndex: number
}
export function OverlayPositionOnCentroid({
  appClassName,
  children,
  feature,
  featureIsShowed = false,
  map,
  options: { margins = defaultMargins } = {},
  zIndex
}: OverlayPositionOnCentroidProps) {
  const dispatch = useAppDispatch()
  const overlayRef = useRef<HTMLDivElement | null>(null)
  const olOverlayObjectRef = useRef<Overlay | null>(null)
  const isThrottled = useRef(false)
  const [showed, setShowed] = useState(false)
  const currentCoordinates = useRef([])
  const overlayCoordinates = useAppSelector(state => state.global.overlayCoordinates)

  const [overlayTopLeftMargin, setOverlayTopLeftMargin] = useState([margins.yBottom, margins.xMiddle])
  const currentOffset = useRef(INITIAL_OFFSET_VALUE)

  const overlayCallback = useCallback(
    (ref: HTMLDivElement) => {
      overlayRef.current = ref
      if (ref) {
        olOverlayObjectRef.current = new Overlay({
          className: `ol-overlay-container ol-selectable ${appClassName}`,
          element: ref,
          offset: currentOffset.current
        })
      } else {
        olOverlayObjectRef.current = null
      }
    },
    [overlayRef, olOverlayObjectRef, appClassName]
  )

  useEffect(() => {
    if (olOverlayObjectRef.current) {
      currentOffset.current = INITIAL_OFFSET_VALUE
      olOverlayObjectRef.current.setOffset(INITIAL_OFFSET_VALUE)
    }
    if (feature) {
      currentCoordinates.current = feature.getGeometry()?.getExtent()
    } else {
      currentCoordinates.current = undefined
    }
  }, [feature])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedHandleChangeResolution = useCallback(
    debounce(() => {
      if (overlayCoordinates) {
        dispatch(removeAllOverlayCoordinates())
      }
    }, 500),
    [overlayCoordinates, dispatch]
  )

  useEffect(() => {
    const view = map.getView()

    view.on('change:resolution', () => {
      debouncedHandleChangeResolution()
    })
  }, [dispatch, map, overlayCoordinates, debouncedHandleChangeResolution])

  useEffect(() => {
    if (map) {
      map.addOverlay(olOverlayObjectRef.current)

      if (featureIsShowed && !showed) {
        setShowed(true)
      }
    }

    return () => {
      map.removeOverlay(olOverlayObjectRef.current)
    }
  }, [map, olOverlayObjectRef, featureIsShowed, showed])

  const moveCardWithThrottle = useCallback(
    (target, delay) => {
      if (isThrottled.current && !currentCoordinates.current) {
        return
      }
      isThrottled.current = true
      window.setTimeout(() => {
        if (currentCoordinates.current) {
          const offset = target.getOffset()
          const pixel = map.getPixelFromCoordinate(currentCoordinates.current)

          const { width } = target.getElement().getBoundingClientRect()

          const nextXPixelCenter = pixel[0] + offset[0] + overlayTopLeftMargin[1] + width / 2
          const nextYPixelCenter = pixel[1] + offset[1] + overlayTopLeftMargin[0]

          const nextCoordinates = map.getCoordinateFromPixel([nextXPixelCenter, nextYPixelCenter])
          const featureContext = feature.getId().split(':')[0]
          dispatch(setOverlayCoordinatesByName({ coordinates: nextCoordinates, name: featureContext }))

          isThrottled.current = false
        }
      }, delay)
    },
    [dispatch, map, overlayTopLeftMargin, feature]
  )

  useEffect(() => {
    function getNextOverlayPosition(featureCenter) {
      const [x, y] = featureCenter
      const extent = map.getView().calculateExtent()
      const boxSize = map.getView().getResolution() * OVERLAY_HEIGHT

      const position = getOverlayPositionForCentroid(boxSize, x, y, extent)

      return position
    }

    if (overlayRef.current && olOverlayObjectRef.current) {
      if (feature && feature.getGeometry()) {
        const featureCenter = getCenter(feature.getGeometry().getExtent())
        olOverlayObjectRef.current.setPosition(featureCenter)
        const nextOverlayPosition = getNextOverlayPosition(featureCenter)
        setOverlayTopLeftMargin(getTopLeftMargin(nextOverlayPosition, margins))
        overlayRef.current.style.display = 'flex'
      } else {
        overlayRef.current.style.display = 'none'
      }
    }
  }, [dispatch, feature, overlayRef, olOverlayObjectRef, map, margins])

  useMoveOverlayWhenDragging(olOverlayObjectRef.current, map, currentOffset, moveCardWithThrottle, showed)

  return (
    <OverlayComponent ref={overlayCallback} $overlayTopLeftMargin={overlayTopLeftMargin} $zIndex={zIndex}>
      {feature && children}
    </OverlayComponent>
  )
}

const OverlayComponent = styled.div<{
  $overlayTopLeftMargin: number[]
  $zIndex: number
}>`
  background-color: ${p => p.theme.color.white};
  border-radius: 2px;
  cursor: grabbing;
  left: ${p => p.$overlayTopLeftMargin[1]}px;
  position: absolute;
  text-align: left;
  top: ${p => p.$overlayTopLeftMargin[0]}px;
  z-index: ${p => p.$zIndex};
`
