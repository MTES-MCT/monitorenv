import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { expandRightMenu } from '../../domain/shared_slices/Global'
import { MapButtonStyle } from '../commonStyles/MapButton.style'
import SaveInterestPoint from './SaveInterestPoint'
import {
  deleteInterestPointBeingDrawed,
  drawInterestPoint,
  endInterestPointDraw
} from '../../domain/shared_slices/InterestPoint'

import { ReactComponent as InterestPointSVG } from '../icons/Point_interet.svg'
import { COLORS } from '../../constants/constants'

const INTEREST_POINT_POSITION_FROM_TOP = 145

const InterestPoint = () => {
  const dispatch = useDispatch()
  const {
    isEditing,
    interestPointBeingDrawed
  } = useSelector(state => state.interestPoint)

  const firstUpdate = useRef(true)
  const [interestPointIsOpen, setInterestPointIsOpen] = useState(false)
  const wrapperRef = useRef(null)

  useEffect(() => {
    if (interestPointIsOpen) {
      firstUpdate.current = false
      document.addEventListener('keydown', escapeFromKeyboard, false)
      if (!isEditing) {
        dispatch(drawInterestPoint())
      }
    } else {
      dispatch(endInterestPointDraw())
      if (!isEditing) {
        dispatch(deleteInterestPointBeingDrawed())
      }
    }
    return (document.removeEventListener('keydown', escapeFromKeyboard))
  }, [interestPointIsOpen, isEditing])

  useEffect(() => {
    setInterestPointIsOpen(isEditing)
  }, [isEditing])

  useEffect(() => {
    if (!interestPointBeingDrawed) {
      setInterestPointIsOpen(false)
    }
  }, [interestPointBeingDrawed])

  const escapeFromKeyboard = event => {
    const escapeKeyCode = 27
    if (event.keyCode === escapeKeyCode) {
      setInterestPointIsOpen(false)
    }
  }

  function openOrCloseInterestPoint () {
    setInterestPointIsOpen(!interestPointIsOpen)
  }

  return (
    <Wrapper ref={wrapperRef}>
      <InterestPointWrapper
        data-cy={'interest-point'}
        isOpen={interestPointIsOpen}
        onMouseEnter={() => dispatch(expandRightMenu())}
        title={'Cr??er un point d\'int??r??t'}
        onClick={openOrCloseInterestPoint}>
        <InterestPointIcon />
      </InterestPointWrapper>
      <SaveInterestPoint
        firstUpdate={firstUpdate.current}
        isOpen={interestPointIsOpen}
        close={() => setInterestPointIsOpen(false)}
        positionFromTop={INTEREST_POINT_POSITION_FROM_TOP}
        />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  transition: all 0.2s;
  z-index: 1000;
`

const InterestPointWrapper = styled(MapButtonStyle)`
  position: absolute;
  display: inline-block;
  background: ${props => props.isOpen ? COLORS.shadowBlue : COLORS.charcoal};
  top: ${INTEREST_POINT_POSITION_FROM_TOP}px;
  z-index: 99;
  height: 40px;
  width: ${props => props.selectedVessel && !props.rightMenuIsOpen ? '5px' : '40px'};
  border-radius: ${props => props.selectedVessel && !props.rightMenuIsOpen ? '1px' : '2px'};
  right: ${props => props.selectedVessel && !props.rightMenuIsOpen ? '0' : '10px'};
  transition: all 0.3s;

  :hover {
      background: ${COLORS.charcoal};
  }
  
  :focus {
      background: ${COLORS.shadowBlue};
  }
`

const InterestPointIcon = styled(InterestPointSVG)`
  width: 40px;
  opacity: ${props => props.$selectedVessel && !props.$rightMenuIsOpen ? '0' : '1'};
  transition: all 0.2s;
`

export default InterestPoint
