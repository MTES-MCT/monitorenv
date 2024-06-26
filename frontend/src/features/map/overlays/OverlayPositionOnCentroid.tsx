import { getCenter, type Extent } from 'ol/extent'
import Overlay from 'ol/Overlay'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { getOverlayPositionForCentroid, getTopLeftMargin } from './position'
import { setOverlayCoordinatesByName } from '../../../domain/shared_slices/Global'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useMoveOverlayWhenDragging } from '../../../hooks/useMoveOverlayWhenDragging'

import type { FeatureLike } from 'ol/Feature'
import type OpenLayerMap from 'ol/Map'

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
  feature: FeatureLike | null | undefined
  featureIsShowed?: boolean
  map: OpenLayerMap
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
  const containerRef = useRef<HTMLDivElement | null>(null)
  const olOverlayRef = useRef<Overlay | null>(null)

  const isThrottled = useRef(false)
  const [isMounted, setIsMounted] = useState(false)

  const currentCoordinates = useRef<Extent | undefined>()

  const [overlayTopLeftMargin, setOverlayTopLeftMargin] = useState([margins.yBottom, margins.xMiddle])
  const currentOffset = useRef(INITIAL_OFFSET_VALUE)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const attachContentToOverlay = useCallback(
    (ref: HTMLDivElement) => {
      containerRef.current = ref
      if (ref) {
        olOverlayRef.current = new Overlay({
          className: `ol-overlay-container ol-selectable ${appClassName}`,
          element: ref,
          offset: currentOffset.current
        })
      } else {
        olOverlayRef.current = null
      }
    },
    [containerRef, olOverlayRef, appClassName]
  )

  useEffect(() => {
    if (olOverlayRef.current) {
      currentOffset.current = INITIAL_OFFSET_VALUE
      olOverlayRef.current.setOffset(INITIAL_OFFSET_VALUE)
    }
    if (feature) {
      currentCoordinates.current = feature.getGeometry()?.getExtent()
    } else {
      currentCoordinates.current = undefined
    }
  }, [feature])

  useEffect(() => {
    if (map && olOverlayRef.current) {
      map.addOverlay(olOverlayRef.current)
    }

    return () => {
      if (map && olOverlayRef.current) {
        map.removeOverlay(olOverlayRef.current)
      }
    }
  }, [map, olOverlayRef, featureIsShowed])

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
          const featureContext = String(feature?.getId())?.split(':')[0]
          if (featureContext) {
            dispatch(setOverlayCoordinatesByName({ coordinates: nextCoordinates, name: featureContext }))
          }
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
      const boxSize = (map.getView()?.getResolution() ?? 0) * OVERLAY_HEIGHT

      const position = getOverlayPositionForCentroid(boxSize, x, y, extent)

      return position
    }

    if (containerRef.current && olOverlayRef.current) {
      if (feature && feature.getGeometry()) {
        const extent = feature.getGeometry()?.getExtent()
        const featureCenter = extent && getCenter(extent)
        olOverlayRef.current.setPosition(featureCenter)
        const nextOverlayPosition = getNextOverlayPosition(featureCenter)
        setOverlayTopLeftMargin(getTopLeftMargin(nextOverlayPosition, margins))
        containerRef.current.style.display = 'flex'
      } else {
        containerRef.current.style.display = 'none'
      }
    }
  }, [dispatch, feature, containerRef, olOverlayRef, map, margins])

  useMoveOverlayWhenDragging(olOverlayRef.current, map, currentOffset, moveCardWithThrottle, isMounted)

  return (
    <OverlayComponent ref={attachContentToOverlay} $overlayTopLeftMargin={overlayTopLeftMargin} $zIndex={zIndex}>
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
