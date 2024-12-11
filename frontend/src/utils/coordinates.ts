import { getCoordinates, WSG84_PROJECTION } from '@mtes-mct/monitor-ui'

import { CoordinatesFormat } from '../domain/entities/map/constants'

import type { Coordinate } from 'ol/coordinate'

export const formatCoordinates = (coordinates: Coordinate, coordinatesFormat: CoordinatesFormat) => {
  const transformedCoordinates = getCoordinates(coordinates, WSG84_PROJECTION, coordinatesFormat)

  if (Array.isArray(transformedCoordinates) && transformedCoordinates.length === 2) {
    return `${transformedCoordinates[0]} ${transformedCoordinates[1]}`
  }

  return ''
}
