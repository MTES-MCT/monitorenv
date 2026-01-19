import { getCoordinates, WSG84_PROJECTION } from '@mtes-mct/monitor-ui'

import { CoordinatesFormat } from '../domain/entities/map/constants'

import type { GeoJSON } from '../domain/types/GeoJSON'
import type { Coordinate } from 'ol/coordinate'

export const formatCoordinatesAsText = (coordinates: Coordinate, coordinatesFormat: CoordinatesFormat) => {
  const transformedCoordinates = getCoordinates(coordinates, WSG84_PROJECTION, coordinatesFormat)

  if (Array.isArray(transformedCoordinates) && transformedCoordinates.length === 2) {
    return `${transformedCoordinates[0]} ${transformedCoordinates[1]}`
  }

  return ''
}

export function formatCoordinates(coordinates: GeoJSON.Position | undefined, coordinatesFormat: CoordinatesFormat) {
  if (!coordinates) {
    return []
  }
  const transformedCoordinates = getCoordinates(coordinates, WSG84_PROJECTION, coordinatesFormat)

  if (Array.isArray(transformedCoordinates) && transformedCoordinates.length === 2) {
    return [transformedCoordinates[0], transformedCoordinates[1]]
  }

  return []
}
