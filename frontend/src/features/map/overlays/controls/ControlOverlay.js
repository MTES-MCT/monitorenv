import React, {  useCallback, useEffect, useRef, useState } from 'react'
// import { useSelector } from 'react-redux'
import styled from 'styled-components'
import Overlay from 'ol/Overlay'
import { getCenter } from 'ol/extent'

import { getOverlayPosition, getTopLeftMargin } from '../position'
import { ControlCard } from './ControlCard'

import { COLORS } from '../../../../constants/constants'
import Layers from '../../../../domain/entities/layers'

const overlayHeight = 74
export const marginsWithoutAlert = {
  xRight: -252,
  xMiddle: -116,
  xLeft: 20,
  yTop: 10,
  yMiddle: -64,
  yBottom: -153
}

export const ControlOverlay = ({ map, currentFeatureOver }) => {
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
      if (currentFeatureOver && currentFeatureOver.getId()?.includes(Layers.ACTIONS.code)) {
        console.log('currentFeatureOver', currentFeatureOver.getProperties())
        const featureCenter =  getCenter(currentFeatureOver.getGeometry().getExtent())
        overlayObjectRef.current.setPosition(featureCenter)
        const nextOverlayPosition = getNextOverlayPosition(featureCenter)
        setOverlayTopLeftMargin(getTopLeftMargin(nextOverlayPosition, marginsWithoutAlert))
        overlayRef.current.style.display = 'block'
      } else {
        overlayRef.current.style.display = 'none'
      }
    }
  }, [currentFeatureOver, overlayRef, overlayObjectRef, map])

  

  return (
    <ControlCardOverlayComponent ref={overlayCallback} overlayTopLeftMargin={overlayTopLeftMargin}>
      {
        currentFeatureOver
          ? <ControlCard
            feature={currentFeatureOver}
            selected={currentFeatureOver}
          />
          : null
      }
    </ControlCardOverlayComponent>
  )
}

const ControlCardOverlayComponent = styled.div`
  position: absolute;
  top: ${props => props.overlayTopLeftMargin[0]}px;
  left: ${props => props.overlayTopLeftMargin[1]}px;
  width: 232px;
  text-align: left;
  background-color: ${COLORS.white};
  border-radius: 2px;
  z-index: 1000;
`