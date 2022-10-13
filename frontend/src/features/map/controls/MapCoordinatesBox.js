import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Radio, RadioGroup } from 'rsuite'
import styled from 'styled-components'

import { COLORS } from '../../../constants/constants'
import { CoordinatesFormat, OPENLAYERS_PROJECTION } from '../../../domain/entities/map'
import { setCoordinatesFormat } from '../../../domain/shared_slices/Map'
import { useTriggerOnClickOutsideComponent } from '../../../hooks/useClickOutside'
import { getCoordinates } from '../../../utils/coordinates'

let lastEventForPointerMove
let timeoutForPointerMove

function MapCoordinatesBox({ map }) {
  const wrapperRef = useRef(null)

  const dispatch = useDispatch()
  const { coordinatesFormat } = useSelector(state => state.map)
  const [cursorCoordinates, setCursorCoordinates] = useState('')
  const [coordinatesSelectionIsOpen, setCoordinatesSelectionIsOpen] = useState(false)
  useTriggerOnClickOutsideComponent(wrapperRef, () => {
    setCoordinatesSelectionIsOpen(false)
  })

  useEffect(() => {
    function saveCoordinates(event) {
      if (event) {
        const clickedCoordinates = map.getCoordinateFromPixel(event.pixel)
        setCursorCoordinates(clickedCoordinates)
      }
    }

    function throttleAndHandlePointerMove(event) {
      if (event.dragging || timeoutForPointerMove) {
        if (timeoutForPointerMove) {
          lastEventForPointerMove = event
        }

        return
      }

      timeoutForPointerMove = setTimeout(() => {
        timeoutForPointerMove = null
        saveCoordinates(lastEventForPointerMove)
      }, 50)
    }

    map.on('pointermove', throttleAndHandlePointerMove)

    return () => map.un('pointermove', throttleAndHandlePointerMove)
  }, [map])

  const getShowedCoordinates = coordinates => {
    const transformedCoordinates = getCoordinates(coordinates, OPENLAYERS_PROJECTION, coordinatesFormat)

    if (Array.isArray(transformedCoordinates) && transformedCoordinates.length === 2) {
      return `${transformedCoordinates[0]} ${transformedCoordinates[1]}`
    }

    return ''
  }

  return (
    <div ref={wrapperRef}>
      <CoordinatesTypeSelection isOpen={coordinatesSelectionIsOpen}>
        <Header data-cy="coordinates-selection" onClick={() => setCoordinatesSelectionIsOpen(false)}>
          Unités des coordonnées
        </Header>
        <RadioWrapper
          inline
          name="coordinatesRadio"
          onChange={value => dispatch(setCoordinatesFormat(value))}
          value={coordinatesFormat}
        >
          <Radio inline title="Degrés Minutes Secondes" value={CoordinatesFormat.DEGREES_MINUTES_SECONDS}>
            DMS
          </Radio>
          <Radio
            data-cy="coordinates-selection-dmd"
            inline
            title="Degrés Minutes Décimales"
            value={CoordinatesFormat.DEGREES_MINUTES_DECIMALS}
          >
            DMD
          </Radio>
          <Radio
            data-cy="coordinates-selection-dd"
            inline
            title="Degrés Décimales"
            value={CoordinatesFormat.DECIMAL_DEGREES}
          >
            DD
          </Radio>
        </RadioWrapper>
      </CoordinatesTypeSelection>
      <Coordinates onClick={() => setCoordinatesSelectionIsOpen(!coordinatesSelectionIsOpen)}>
        {getShowedCoordinates(cursorCoordinates)} ({coordinatesFormat})
      </Coordinates>
    </div>
  )
}

const RadioWrapper = styled(RadioGroup)`
  padding: 6px 12px 12px 12px !important;
`

const Header = styled.span`
  background-color: ${COLORS.charcoal};
  color: ${COLORS.cultured};
  padding: 5px 0;
  width: 100%;
  display: inline-block;
  cursor: pointer;
  border: none;
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
`

const CoordinatesTypeSelection = styled.span`
  position: absolute;
  bottom: ${props => (props.isOpen ? 40 : -40)}px;
  left: 40px;
  display: inline-block;
  margin: 1px;
  color: ${COLORS.slateGray};
  font-size: 13px;
  font-weight: 300;
  text-decoration: none;
  text-align: center;
  background-color: ${COLORS.background};
  border: none;
  border-radius: 2px;
  width: 237px;
  opacity: ${props => (props.isOpen ? 1 : 0)};
  transition: all 0.5s;
`

const Coordinates = styled.span`
  box-sizing: content-box;
  position: absolute;
  bottom: 11px;
  left: 40px;
  display: inline-block;
  padding: 2px 0 6px 2px;
  color: ${COLORS.gainsboro};
  font-size: 13px;
  font-weight: 300;
  text-decoration: none;
  text-align: center;
  height: 17px;
  background-color: ${COLORS.charcoal};
  border: none;
  border-radius: 2px;
  width: 235px;
  cursor: pointer;
`

export default MapCoordinatesBox
