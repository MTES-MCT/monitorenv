// @ts-nocheck
import { getCenter } from 'ol/extent'
import Overlay from 'ol/Overlay'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { COLORS } from '../../../constants/constants'
import { setOverlayPosition } from '../../../domain/shared_slices/Global'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useMoveOverlayWhenDragging } from '../../../hooks/useMoveOverlayWhenDragging'
import { getOverlayPositionForCentroid, getTopLeftMargin } from './position'

const OVERLAY_HEIGHT = 74

const INITIAL_OFFSET_VALUE = [-90, 10]
const defaultMargins = {
  xLeft: 30,
  xMiddle: -155,
  xRight: -340,
  yBottom: -155,
  yMiddle: -60,
  yTop: 20
}

export function OverlayPositionOnCentroid({
  map,
  feature,
  appClassName,
  children,
  options: { margins = defaultMargins } = {},
  featureIsShowed = false
}) {
  const dispatch = useAppDispatch()
  const overlayRef = useRef(null)
  const olOverlayObjectRef = useRef(null)
  const isThrottled = useRef(false)
  const [showed, setShowed] = useState(false)
  const currentCoordinates = useRef([])

  const [overlayTopLeftMargin, setOverlayTopLeftMargin] = useState([margins.yBottom, margins.xMiddle])
  const currentOffset = useRef(INITIAL_OFFSET_VALUE)

  const overlayCallback = useCallback(
    ref => {
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
      currentCoordinates.current = feature?.getGeometry()?.getCoordinates()
    } else {
      currentCoordinates.current = undefined
    }
  }, [feature])

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
      setTimeout(() => {
        if (currentCoordinates.current) {
          const offset = target.getOffset()
          const pixel = map.getPixelFromCoordinate(currentCoordinates.current)

          const { width } = target.getElement().getBoundingClientRect()
          const nextXPixelCenter = pixel[0] + offset[0] - 50 + width / 2
          const nextYPixelCenter = pixel[1] + offset[1] - 120

          const nextCoordinates = map.getCoordinateFromPixel([nextXPixelCenter, nextYPixelCenter])
          dispatch(setOverlayPosition(nextCoordinates))

          isThrottled.current = false
        }
      }, delay)
    },
    [dispatch, map]
  )

  useEffect(() => {
    function getNextOverlayPosition(featureCenter) {
      const [x, y] = featureCenter
      const extent = map.getView().calculateExtent()
      const boxSize = map.getView().getResolution() * OVERLAY_HEIGHT

      return getOverlayPositionForCentroid(boxSize, x, y, extent)
    }

    if (overlayRef.current && olOverlayObjectRef.current) {
      if (feature) {
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
    <OverlayComponent ref={overlayCallback} overlayTopLeftMargin={overlayTopLeftMargin}>
      {feature && children}
    </OverlayComponent>
  )
}

const OverlayComponent = styled.div`
  position: absolute;
  top: ${props => props.overlayTopLeftMargin[0]}px;
  left: ${props => props.overlayTopLeftMargin[1]}px;
  text-align: left;
  background-color: ${COLORS.white};
  border-radius: 2px;
`
