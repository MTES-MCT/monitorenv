// @ts-nocheck
import { getCenter } from 'ol/extent'
import Overlay from 'ol/Overlay'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { COLORS } from '../../../constants/constants'
import { getOverlayPositionForExtent, getTopLeftMarginForFeature } from './position'

const OVERLAY_HEIGHT = 124
const OVERLAY_WIDTH = 365

const defaultMargins = {
  left: {
    center: 20,
    left: 20,
    right: 20
  },
  top: {
    bottom: 20,
    middle: 20,
    top: 20
  }
}

export function OverlayPositionOnExtent({
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
    if (overlayRef.current && olOverlayObjectRef.current) {
      if (feature) {
        const featureExtent = feature.getGeometry().getExtent()
        const featureCenter = getCenter(featureExtent)
        const resolution = map.getView().getResolution()
        const extent = map.getView().calculateExtent()

        const nextOverlayPosition = getOverlayPositionForExtent(featureExtent, extent, margins, {
          height: OVERLAY_HEIGHT,
          resolution,
          width: OVERLAY_WIDTH
        })

        const containerMargins = getTopLeftMarginForFeature(
          nextOverlayPosition,
          margins,
          featureExtent,
          featureCenter,
          { height: OVERLAY_HEIGHT, resolution, width: OVERLAY_WIDTH }
        )

        olOverlayObjectRef.current.setPosition(featureCenter)
        setOverlayTopLeftMargin(containerMargins)
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
  position: relative;
  top: ${props => props.overlayTopLeftMargin[0]}px;
  left: ${props => props.overlayTopLeftMargin[1]}px;
  text-align: left;
  background-color: ${COLORS.white};
  border-radius: 2px;
`
