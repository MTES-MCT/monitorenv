import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import SaveInterestPoint from './SaveInterestPoint'
import {
  deleteInterestPointBeingDrawed,
  drawInterestPoint,
  endInterestPointDraw
} from '../../domain/shared_slices/InterestPoint'

import { ReactComponent as InterestPointSVG } from '../icons/Point_interet.svg'
import { IconButton } from 'rsuite'

const INTEREST_POINT_POSITION_FROM_LEFT = 470

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
      <IconButton
        data-cy={'interest-point'}
        title={'Créer un point d\'intérêt'}
        onClick={openOrCloseInterestPoint}
        appearance='primary'
        size='sm'
        icon={<InterestPointIcon className={"rs-icon"} />}
        
       />
      <SaveInterestPoint
        firstUpdate={firstUpdate.current}
        isOpen={interestPointIsOpen}
        close={() => setInterestPointIsOpen(false)}
        />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  position: absolute;
  bottom: 11px;
  left: ${INTEREST_POINT_POSITION_FROM_LEFT}px;
  width: 20px;
  transition: all 0.2s;
  z-index: 1000;
`

const InterestPointIcon = styled(InterestPointSVG)`
  width: 20px;
  height: 20px;
`

export default InterestPoint
