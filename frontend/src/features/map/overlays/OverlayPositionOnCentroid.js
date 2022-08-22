import React, {  useCallback, useEffect, useRef, useState } from 'react'
// import { useSelector } from 'react-redux'
import styled from 'styled-components'
import Overlay from 'ol/Overlay'
import { getCenter } from 'ol/extent'

import { getOverlayPosition, getTopLeftMargin } from './position'

import { COLORS } from '../../../constants/constants'

const overlayHeight = 74
const defaultMarginsWithoutAlert = {
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
  children, 
  options: {
    marginsWithoutAlert = defaultMarginsWithoutAlert
  } = {}
}) => {
  const overlayRef = useRef(null)
  const overlayObjectRef = useRef(null)
  const [overlayTopLeftMargin, setOverlayTopLeftMargin] = useState([marginsWithoutAlert.yBottom, marginsWithoutAlert.xMiddle])

  const overlayCallback = useCallback(ref => {
    overlayRef.current = ref
    if (ref) {
      overlayObjectRef.current = new Overlay({
        element: ref,
      })
    } else {
      overlayObjectRef.current = null
    }
  }, [overlayRef, overlayObjectRef])

  useEffect(() => {
    if (map) {
      map.addOverlay(overlayObjectRef.current)
    }
    return () => {
      map.removeOverlay(overlayObjectRef.current)
    }
  }, [map, overlayObjectRef])

  useEffect(() => {
    function getNextOverlayPosition (featureCenter) {
      const [x, y] = featureCenter
      const extent = map.getView().calculateExtent()
      const boxSize = map.getView().getResolution() * overlayHeight
      return getOverlayPosition(boxSize, x, y, extent)
    }

    if (overlayRef.current && overlayObjectRef.current) {
      if (feature) {
        const featureCenter =  getCenter(feature.getGeometry().getExtent())
        overlayObjectRef.current.setPosition(featureCenter)
        const nextOverlayPosition = getNextOverlayPosition(featureCenter)
        setOverlayTopLeftMargin(getTopLeftMargin(nextOverlayPosition, marginsWithoutAlert))
        overlayRef.current.style.display = 'block'
      } else {
        overlayRef.current.style.display = 'none'
      }
    }
  }, [feature, overlayRef, overlayObjectRef, map])

  
  return (
    <MissionCardOverlayComponent ref={overlayCallback} overlayTopLeftMargin={overlayTopLeftMargin}>
      { feature && children }
    </MissionCardOverlayComponent>
  )
}

const MissionCardOverlayComponent = styled.div`
  position: absolute;
  top: ${props => props.overlayTopLeftMargin[0]}px;
  left: ${props => props.overlayTopLeftMargin[1]}px;
  text-align: left;
  background-color: ${COLORS.white};
  border-radius: 2px;
`