import React, { useEffect, useState } from 'react'
import CoordinateInput from 'react-coordinate-input'
import styled from 'styled-components'

import { COLORS } from '../../constants/constants'
import { usePrevious } from '../../hooks/usePrevious'

function DMSCoordinatesInput(props) {
  const {
    coordinates,
    /** @type {string} coordinates - In the [latitude, longitude] format */
    coordinatesFormat,
    getCoordinatesFromFormat,
    updateCoordinates
  } = props

  const [update, setUpdate] = useState([])
  const previousUpdate = usePrevious(update)
  const [showedValue, setShowedValue] = useState(undefined)

  /** Convert the coordinates to the [latitude, longitude] string format */
  useEffect(() => {
    if (coordinates?.length && coordinatesFormat) {
      setShowedValue(getCoordinatesFromFormat(coordinates, coordinatesFormat))
    } else {
      setShowedValue('')
      setUpdate([])
    }
  }, [coordinates, coordinatesFormat])

  useEffect(() => {
    if (
      previousUpdate?.length &&
      update?.length &&
      update[0] === previousUpdate[0] &&
      update[1] === previousUpdate[1]
    ) {
      return
    }

    if (coordinatesAreModified()) {
      updateCoordinates(update, coordinates)
      setShowedValue(undefined)
      setUpdate([])
    }
  }, [update, coordinates, updateCoordinates])

  function coordinatesAreModified() {
    return coordinates?.length
      ? update?.length && (update[0] !== coordinates[0] || update[1] !== coordinates[1])
      : update?.length
  }

  return (
    <Body>
      <CoordinateInput
        data-cy="dms-coordinates-input"
        ddPrecision={6}
        onChange={(_, { dd }) => setUpdate(dd)}
        value={showedValue}
      />
      <CoordinatesType>(DMS)</CoordinatesType>
    </Body>
  )
}

const CoordinatesType = styled.span`
  margin-left: 7px;
`

const Body = styled.div`
  text-align: left;
  font-size: 13px;

  input {
    margin-top: 7px;
    background: ${COLORS.gainsboro};
    border: none;
    height: 27px;
    padding-left: 8px;
    width: 200px;
  }
`

export default DMSCoordinatesInput
