// @ts-nocheck
import { getCenter } from 'ol/extent'
import Overlay from 'ol/Overlay'
import React, { useCallback, useEffect, useRef, useState } from 'react'
// import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { COLORS } from '../../../constants/constants'
import { getOverlayPositionForCentroid, getTopLeftMargin } from './position'

const OVERLAY_HEIGHT = 74

const defaultMargins = {
  xLeft: 20,
  xMiddle: -116,
  xRight: -252,
  yBottom: -153,
  yMiddle: -64,
  yTop: 10
}

export function OverlayPositionOnCentroid({
  map,
  feature,
  appClassName,
  children,
  options: { margins = defaultMargins } = {}
}) {
  const overlayRef = useRef(null)
  const olOverlayObjectRef = useRef(null)
  const [overlayTopLeftMargin, setOverlayTopLeftMargin] = useState([margins.yBottom, margins.xMiddle])

  const overlayCallback = useCallback(
    ref => {
      overlayRef.current = ref
      if (ref) {
        olOverlayObjectRef.current = new Overlay({
          className: `ol-overlay-container ol-selectable ${appClassName}`,
          element: ref
        })
      } else {
        olOverlayObjectRef.current = null
      }
    },
    [overlayRef, olOverlayObjectRef, appClassName]
  )

  useEffect(() => {
    if (map) {
      map.addOverlay(olOverlayObjectRef.current)
    }

    return () => {
      map.removeOverlay(olOverlayObjectRef.current)
    }
  }, [map, olOverlayObjectRef])

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
  }, [feature, overlayRef, olOverlayObjectRef, map, margins])

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
