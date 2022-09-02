import React, {  useCallback, useEffect, useRef, useState } from 'react'
// import { useSelector } from 'react-redux'
import styled from 'styled-components'
import Overlay from 'ol/Overlay'
import { getCenter } from 'ol/extent'

import { getOverlayPositionForCentroid, getTopLeftMargin } from './position'

import { COLORS } from '../../../constants/constants'

const OVERLAY_HEIGHT = 74

const defaultMargins = {
  xRight: -252,
  xMiddle: -116,
  xLeft: 20,
  yTop: 10,
  yMiddle: -64,
  yBottom: -153
}

export const OverlayPositionOnCentroid = ({
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
    function getNextOverlayPosition (featureCenter) {
      const [x, y] = featureCenter
      const extent = map.getView().calculateExtent()
      const boxSize = map.getView().getResolution() * OVERLAY_HEIGHT
      return getOverlayPositionForCentroid(boxSize, x, y, extent)
    }

    if (overlayRef.current && olOverlayObjectRef.current) {
      if (feature) {
        const featureCenter =  getCenter(feature.getGeometry().getExtent())
        olOverlayObjectRef.current.setPosition(featureCenter)
        const nextOverlayPosition = getNextOverlayPosition(featureCenter)
        setOverlayTopLeftMargin(getTopLeftMargin(nextOverlayPosition, margins))
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
  position: absolute;
  top: ${props => props.overlayTopLeftMargin[0]}px;
  left: ${props => props.overlayTopLeftMargin[1]}px;
  text-align: left;
  background-color: ${COLORS.white};
  border-radius: 2px;
`