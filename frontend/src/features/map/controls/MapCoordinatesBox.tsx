import { MultiRadio, getOptionsFromLabelledEnum } from '@mtes-mct/monitor-ui'
import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import {
  CoordinatesFormat,
  CoordinatesFormatLabel,
  OPENLAYERS_PROJECTION
} from '../../../domain/entities/map/constants'
import { setCoordinatesFormat } from '../../../domain/shared_slices/Map'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { useClickOutsideWhenOpened } from '../../../hooks/useClickOutsideWhenOpened'
import { getCoordinates } from '../../../utils/coordinates'

import type { BaseMapChildrenProps } from '../BaseMap'
import type { Coordinate } from 'ol/coordinate'

let lastEventForPointerMove
let timeoutForPointerMove

const COORDINATES_OPTIONS = getOptionsFromLabelledEnum(CoordinatesFormatLabel)

export function MapCoordinatesBox({ map }: BaseMapChildrenProps) {
  const [coordinates, setCursorCoordinates] = useState<Coordinate>()

  useEffect(() => {
    function throttleAndHandlePointerMove(event) {
      if (event.dragging || timeoutForPointerMove) {
        if (timeoutForPointerMove) {
          lastEventForPointerMove = event
        }

        return
      }

      timeoutForPointerMove = window.setTimeout(() => {
        timeoutForPointerMove = null

        saveCoordinates(lastEventForPointerMove)
      }, 50)
    }
    function saveCoordinates(event) {
      if (event) {
        const clickedCoordinates = map?.getCoordinateFromPixel(event.pixel)
        if (clickedCoordinates) {
          setCursorCoordinates(clickedCoordinates)
        }
      }
    }
    if (map) {
      map.on('pointermove', event => throttleAndHandlePointerMove(event))
    }
  })

  const wrapperRef = useRef(null)

  const dispatch = useAppDispatch()
  const coordinatesFormat = useAppSelector(state => state.map.coordinatesFormat) as CoordinatesFormat
  const [coordinatesSelectionIsOpen, setCoordinatesSelectionIsOpen] = useState(false)
  const clickedOutsideComponent = useClickOutsideWhenOpened(wrapperRef, coordinatesSelectionIsOpen)

  const selectCordinatesFormat = value => {
    if (!value) {
      return
    }
    dispatch(setCoordinatesFormat(value))
  }

  useEffect(() => {
    if (clickedOutsideComponent) {
      setCoordinatesSelectionIsOpen(false)
    }
  }, [clickedOutsideComponent])

  return (
    <StyledCoordinatesContainer ref={wrapperRef}>
      <CoordinatesTypeSelection isOpen={coordinatesSelectionIsOpen}>
        <Header data-cy="coordinates-selection" onClick={() => setCoordinatesSelectionIsOpen(false)}>
          Unités des coordonnées
        </Header>
        <RadioContainer>
          <MultiRadio
            data-cy="coordinates-radio"
            isInline
            isLabelHidden
            label="Unités des coordonnées"
            name="coordinatesRadio"
            onChange={selectCordinatesFormat}
            options={COORDINATES_OPTIONS}
            value={coordinatesFormat}
          />
        </RadioContainer>
      </CoordinatesTypeSelection>
      <Coordinates onClick={() => setCoordinatesSelectionIsOpen(!coordinatesSelectionIsOpen)}>
        {getShowedCoordinates(coordinates, coordinatesFormat)} ({coordinatesFormat})
      </Coordinates>
    </StyledCoordinatesContainer>
  )
}

const getShowedCoordinates = (coordinates, coordinatesFormat) => {
  const transformedCoordinates = getCoordinates(coordinates, OPENLAYERS_PROJECTION, coordinatesFormat)

  if (Array.isArray(transformedCoordinates) && transformedCoordinates.length === 2) {
    return `${transformedCoordinates[0]} ${transformedCoordinates[1]}`
  }

  return ''
}

const StyledCoordinatesContainer = styled.div`
  z-index: 2;
`
const RadioContainer = styled.div`
  padding: 6px 12px 12px 12px !important;
`

const Header = styled.span`
  background-color: ${p => p.theme.color.charcoal};
  color: ${p => p.theme.color.gainsboro};
  padding: 5px 0;
  width: 100%;
  display: inline-block;
  cursor: pointer;
  border: none;
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
`

const CoordinatesTypeSelection = styled.span<{ isOpen: boolean }>`
  position: absolute;
  bottom: 40px;
  left: 40px;
  display: inline-block;
  margin: 1px;
  color: ${p => p.theme.color.slateGray};
  text-align: center;
  background-color: ${p => p.theme.color.white};
  width: 237px;
  opacity: ${props => (props.isOpen ? 1 : 0)};
  visibility: ${props => (props.isOpen ? 'visible' : 'hidden')};
  height: ${props => (props.isOpen ? 69 : 0)}px;
  transition: all 0.5s;
  overflow: hidden;
`

const Coordinates = styled.span`
  box-sizing: content-box;
  position: absolute;
  bottom: 11px;
  left: 40px;
  display: inline-block;
  padding: 2px 0 6px 2px;
  color: ${p => p.theme.color.gainsboro};
  text-align: center;
  height: 17px;
  background-color: ${p => p.theme.color.charcoal};
  width: 235px;
  cursor: pointer;
`
