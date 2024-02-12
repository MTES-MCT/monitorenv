// @ts-nocheck
import { getCenter } from 'ol/extent'
import Overlay from 'ol/Overlay'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

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

type OverlayPositionOnExtentProps = {
  appClassName: string
  children: React.ReactNode
  feature: Feature<Geometry> | null | undefined
  map: any
  options?: {
    margins?: {
      left: {
        center: number
        left: number
        right: number
      }
      top: {
        bottom: number
        middle: number
        top: number
      }
    }
  }
  zIndex: number
}

export function OverlayPositionOnExtent({
  appClassName,
  children,
  feature,
  map,
  options: { margins = defaultMargins } = {},
  zIndex
}: OverlayPositionOnExtentProps) {
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
      if (feature && feature.getGeometry()) {
        const featureExtent = feature.getGeometry().getExtent()
        const featureCenter = getCenter(featureExtent)
        const resolution = map.getView().getResolution()
        const extent = map.getView().calculateExtent()

        const nextOverlayPosition = getOverlayPositionForExtent(featureExtent, extent, {
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
    <OverlayComponent ref={overlayCallback} $overlayTopLeftMargin={overlayTopLeftMargin} $zIndex={zIndex}>
      {feature && children}
    </OverlayComponent>
  )
}

const OverlayComponent = styled.div<{ $overlayTopLeftMargin: number[]; $zIndex: number }>`
  background-color: ${p => p.theme.color.white};
  border-radius: 2px;
  left: ${p => p.$overlayTopLeftMargin[1]}px;
  position: relative;
  text-align: left;
  top: ${p => p.$overlayTopLeftMargin[0]}px;
  z-index: ${p => p.$zIndex};
`
