import { useCallback, useEffect, useMemo, useRef } from 'react'
import styled from 'styled-components'

import { MapToolType } from '../../../../domain/entities/map/constants'
import { setMapToolOpened } from '../../../../domain/shared_slices/Global'
import {
  deleteInterestPointBeingDrawed,
  drawInterestPoint,
  endInterestPointDraw
} from '../../../../domain/shared_slices/InterestPoint'
import { useAppDispatch } from '../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { useEscapeFromKeyboardAndExecute } from '../../../../hooks/useEscapeFromKeyboardAndExecute'
import { ReactComponent as InterestPointSVG } from '../../../../uiMonitor/icons/Landmark.svg'
import { MapToolButton } from '../MapToolButton'
import { EditInterestPoint } from './EditInterestPoint'

export function InterestPointMapButton() {
  const dispatch = useAppDispatch()
  const { displayInterestPoint, healthcheckTextWarning, mapToolOpened, rightMenuIsOpen } = useAppSelector(
    state => state.global
  )
  const isRightMenuShrinked = !rightMenuIsOpen
  const isOpen = useMemo(() => mapToolOpened === MapToolType.INTEREST_POINT, [mapToolOpened])
  const wrapperRef = useRef(null)

  const close = useCallback(() => {
    dispatch(setMapToolOpened(undefined))
  }, [dispatch])

  useEscapeFromKeyboardAndExecute(close)

  useEffect(() => {
    if (!isOpen) {
      dispatch(endInterestPointDraw())
      dispatch(deleteInterestPointBeingDrawed())
    }
  }, [dispatch, isOpen])

  const openOrCloseInterestPoint = useCallback(() => {
    if (!isOpen) {
      dispatch(drawInterestPoint())
      dispatch(setMapToolOpened(MapToolType.INTEREST_POINT))
    } else {
      close()
    }
  }, [dispatch, isOpen, close])

  return (
    <Wrapper ref={wrapperRef}>
      <MapToolButton
        dataCy="interest-point"
        isHidden={!displayInterestPoint}
        isOpen={isOpen}
        onClick={openOrCloseInterestPoint}
        style={{ top: 291 }}
        title={"Créer un point d'intérêt"}
      >
        <InterestPointIcon $isRightMenuShrinked={isRightMenuShrinked} />
      </MapToolButton>
      <EditInterestPoint close={close} healthcheckTextWarning={healthcheckTextWarning} isOpen={isOpen} />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  transition: all 0.2s;
  z-index: 1000;
`

const InterestPointIcon = styled(InterestPointSVG)<{
  $isRightMenuShrinked: boolean
}>`
  height: 25px;
  opacity: ${p => (p.$isRightMenuShrinked ? '0' : '1')};
  transition: all 0.2s;
  width: 25px;

  rect:first-of-type {
    fill: ${p => p.theme.color.gainsboro};
  }

  path:first-of-type {
    fill: ${p => p.theme.color.gainsboro};
  }
`
