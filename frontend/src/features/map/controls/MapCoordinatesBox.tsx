import { getCoordinates, getOptionsFromLabelledEnum, MultiRadio, OPENLAYERS_PROJECTION } from '@mtes-mct/monitor-ui'
import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { CoordinatesFormat, CoordinatesFormatLabel } from '../../../domain/entities/map/constants'
import { setCoordinatesFormat } from '../../../domain/shared_slices/Map'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { useClickOutsideWhenOpened } from '../../../hooks/useClickOutsideWhenOpened'

import type { BaseMapChildrenProps } from '../BaseMap'
import type { Coordinate } from 'ol/coordinate'

let lastEventForPointerMove
let timeoutForPointerMove

export const COORDINATES_OPTIONS = getOptionsFromLabelledEnum(CoordinatesFormatLabel)

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

    return () => {
      clearTimeout(timeoutForPointerMove)
      if (map) {
        map.un('pointermove', event => throttleAndHandlePointerMove(event))
      }
    }
  }, [map])

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
    <div ref={wrapperRef}>
      <CoordinatesTypeSelection $isOpen={coordinatesSelectionIsOpen}>
        <Header data-cy="coordinates-selection" onClick={() => setCoordinatesSelectionIsOpen(false)}>
          Unités des coordonnées
        </Header>
        <StyledMultiRadio
          data-cy="coordinates-radio"
          isInline
          isLabelHidden
          label="Unités des coordonnées"
          name="coordinatesRadio"
          onChange={selectCordinatesFormat}
          options={COORDINATES_OPTIONS}
          value={coordinatesFormat}
        />
      </CoordinatesTypeSelection>
      <Coordinates onClick={() => setCoordinatesSelectionIsOpen(!coordinatesSelectionIsOpen)}>
        {getShowedCoordinates(coordinates, coordinatesFormat)} ({coordinatesFormat})
      </Coordinates>
    </div>
  )
}

const getShowedCoordinates = (coordinates, coordinatesFormat) => {
  const transformedCoordinates = getCoordinates(coordinates, OPENLAYERS_PROJECTION, coordinatesFormat)

  if (Array.isArray(transformedCoordinates) && transformedCoordinates.length === 2) {
    return `${transformedCoordinates[0]} ${transformedCoordinates[1]}`
  }

  return ''
}

const StyledMultiRadio = styled(MultiRadio)`
  padding: 12px;
`

const Header = styled.header`
  background-color: ${p => p.theme.color.charcoal};
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
  border: none;
  color: ${p => p.theme.color.gainsboro};
  cursor: pointer;
  display: inline-block;
  padding: 5px 0;
  width: 100%;
`

const CoordinatesTypeSelection = styled.span<{ $isOpen: boolean }>`
  background-color: ${p => p.theme.color.white};
  bottom: 40px;
  color: ${p => p.theme.color.slateGray};
  display: inline-block;
  height: ${props => (props.$isOpen ? 69 : 0)}px;
  left: 40px;
  margin: 1px;
  text-align: center;
  transition: all 0.5s;
  opacity: ${props => (props.$isOpen ? 1 : 0)};
  overflow: hidden;
  position: absolute;
  visibility: ${props => (props.$isOpen ? 'visible' : 'hidden')};
  width: 234px;
`

const Coordinates = styled.span`
  background-color: ${p => p.theme.color.charcoal};
  bottom: 9px;
  color: ${p => p.theme.color.gainsboro};
  cursor: pointer;
  display: inline-block;
  font-size: 12px;
  left: 40px;
  padding: 3px 0 3px 2px;
  position: absolute;
  text-align: center;
  width: 235px;
`
