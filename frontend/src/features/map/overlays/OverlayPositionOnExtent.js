import React, {  useCallback, useEffect, useRef, useState } from 'react'
// import { useSelector } from 'react-redux'
import styled from 'styled-components'
import Overlay from 'ol/Overlay'
import { getCenter } from 'ol/extent'

import { getOverlayPositionForExtent, getTopLeftMarginForFeature } from './position'

import { COLORS } from '../../../constants/constants'

const OVERLAY_HEIGHT = 124
const OVERLAY_WIDTH = 365

const defaultMargins = {
  top: {
    top: 20,
    middle: 20,
    bottom: 20
  },
  left: {
    right: 20,
    center: 20,
    left: 20,
  }
}

export const OverlayPositionOnExtent = ({
  map, 
  feature,
  appClassName, 
  children, 
  options: {
    margins = defaultMargins
  } = {}
}) => {
  const overlayRef = useRef(null)
  const olOverlayObjectRef = useRef(null)
  const [overlayTopLeftMargin, setOverlayTopLeftMargin] = useState([margins.yBottom, margins.xMiddle])

  const overlayCallback = useCallback(ref => {
    overlayRef.current = ref
    if (ref) {
      olOverlayObjectRef.current = new Overlay({
        element: ref,
        className: `ol-overlay-container ol-selectable ${appClassName}`
      })
    } else {
      olOverlayObjectRef.current = null
    }
  }, [overlayRef, olOverlayObjectRef])

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
        const featureExtent =  feature.getGeometry().getExtent()
        const featureCenter =  getCenter(featureExtent)
        const resolution = map.getView().getResolution()
        const extent = map.getView().calculateExtent()

        const nextOverlayPosition = getOverlayPositionForExtent(
          featureExtent, 
          extent,
          margins,
          {width: OVERLAY_WIDTH, height: OVERLAY_HEIGHT, resolution}
          )

        const containerMargins = getTopLeftMarginForFeature(
           nextOverlayPosition,
           margins,
           featureExtent, 
           featureCenter, 
           {width: OVERLAY_WIDTH, height: OVERLAY_HEIGHT, resolution}
           )

        olOverlayObjectRef.current.setPosition(featureCenter)
        setOverlayTopLeftMargin(containerMargins)
        overlayRef.current.style.display = 'block'
      } else {
        overlayRef.current.style.display = 'none'
      }
    }
  }, [feature, overlayRef, olOverlayObjectRef, map])

  
  return (
    <OverlayComponent ref={overlayCallback} overlayTopLeftMargin={overlayTopLeftMargin}>
      { feature && children }
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