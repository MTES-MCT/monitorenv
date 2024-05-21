import { useCallback, useMemo } from 'react'
import CoordinateInput from 'react-coordinate-input'
import styled from 'styled-components'

import type { CoordinatesFormat } from '../../domain/entities/map/constants'

type DMSCoordinatesInputProps = {
  coordinates: number[]
  coordinatesFormat: CoordinatesFormat
  updateCoordinates: (nextCoordinates: number[], coordinates: number[]) => void
}
export function DMSCoordinatesInput({ coordinates, coordinatesFormat, updateCoordinates }: DMSCoordinatesInputProps) {
  /** Convert the coordinates to the [latitude, longitude] string format */
  const showedValue = useMemo(() => {
    if (!coordinates?.length || !coordinatesFormat) {
      return ''
    }

    return coordinates?.join(', ') || ''
  }, [coordinates, coordinatesFormat])

  const update = useCallback(
    nextCoordinates => {
      updateCoordinates(nextCoordinates, coordinates)
    },
    [coordinates, updateCoordinates]
  )

  return (
    <Body>
      <CoordinateInput
        data-cy="dms-coordinates-input"
        ddPrecision={6}
        onChange={(_, { dd }) => update(dd)}
        value={showedValue}
      />
      <CoordinatesType>(DMS)</CoordinatesType>
    </Body>
  )
}

const CoordinatesType = styled.span`
  margin-left: 7px;
  color: ${p => p.theme.color.charcoal};
`

const Body = styled.div`
  font-size: 13px;
  text-align: left;

  input {
    width: 200px;
  }
`
