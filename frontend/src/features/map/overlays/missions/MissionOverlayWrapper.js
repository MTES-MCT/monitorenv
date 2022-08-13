import React, {  useCallback, useEffect, useRef, useState } from 'react'
// import { useSelector } from 'react-redux'
import styled from 'styled-components'
import Overlay from 'ol/Overlay'
import { getCenter } from 'ol/extent'

import { getOverlayPosition, getTopLeftMargin } from '../position'
import { MissionCard } from './MissionCard'

import { COLORS } from '../../../../constants/constants'
import { actionTypeEnum } from '../../../../domain/entities/missions'
import { ActionCard } from './ActionCard'

const overlayHeight = 74
export const marginsWithoutAlert = {
  xRight: -252,
  xMiddle: -116,
  xLeft: 20,
  yTop: 10,
  yMiddle: -64,
  yBottom: -153
}

export const MissionOverlayWrapper = ({ map, feature, selected }) => {
  console.log("over", feature, 'selected', selected)
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

  let renderedComponent = null
  if (feature && feature.get('missionId')) {
    renderedComponent = (<MissionCard
      feature={feature}
      selected={selected}
    />)
  } else if (feature && feature.get('actionType') === actionTypeEnum.CONTROL.code ) {
    renderedComponent = (<ActionCard  feature={feature}
      selected={selected}
      />)
  }
  return (
    <MissionCardOverlayComponent selected={selected} ref={overlayCallback} overlayTopLeftMargin={overlayTopLeftMargin}>
      {
        renderedComponent
      }
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
  && {
    z-index: ${props => props.selected ? 1000 : 1010};
  }
`