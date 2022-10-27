import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { IconButton } from 'rsuite'
import styled from 'styled-components'

import {
  deleteInterestPointBeingDrawed,
  drawInterestPoint,
  endInterestPointDraw
} from '../../domain/shared_slices/InterestPoint'
import { ReactComponent as InterestPointSVG } from '../../uiMonitor/icons/Landmark.svg'
import SaveInterestPoint from './SaveInterestPoint'

const INTEREST_POINT_POSITION_FROM_LEFT = 478

function InterestPoint() {
  const dispatch = useDispatch()
  const { interestPointBeingDrawed, isEditing } = useSelector(state => state.interestPoint)

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

    return document.removeEventListener('keydown', escapeFromKeyboard)
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

  function openOrCloseInterestPoint() {
    setInterestPointIsOpen(!interestPointIsOpen)
  }

  return (
    <Wrapper ref={wrapperRef}>
      <IconButton
        appearance="primary"
        data-cy="interest-point"
        icon={<InterestPointIcon className="rs-icon" />}
        onClick={openOrCloseInterestPoint}
        size="md"
        title={"Créer un point d'intérêt"}
      />
      <SaveInterestPoint
        close={() => setInterestPointIsOpen(false)}
        firstUpdate={firstUpdate.current}
        isOpen={interestPointIsOpen}
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
