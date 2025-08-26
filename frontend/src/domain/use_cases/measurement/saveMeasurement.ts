import { getGeoJSONFromFeature } from 'domain/types/map'
import { type Geometry, Polygon } from 'ol/geom'
import Circle from 'ol/geom/Circle'
import LineString from 'ol/geom/LineString'
import { fromCircle } from 'ol/geom/Polygon'

import { DistanceUnit } from '../../entities/map/constants'
import { addMeasurementDrawed } from '../../shared_slices/Measurement'

import type { Feature } from 'ol'
import type { Coordinate } from 'ol/coordinate'

export const saveMeasurement = (feature: Feature<Geometry>, measurement: number) => (dispatch, getState) => {
  const { distanceUnit } = getState().map
  feature.setId(feature.getProperties().geometry.ol_uid)

  const geom = feature.getGeometry()
  let tooltipCoordinates: Coordinate | undefined
  if (geom instanceof LineString) {
    tooltipCoordinates = geom.getLastCoordinate()
  }
  if (geom instanceof Circle) {
    feature.setGeometry(fromCircle(geom))
    tooltipCoordinates = geom.getLastCoordinate()
  }
  if (geom instanceof Polygon) {
    tooltipCoordinates = geom.getLastCoordinate()
  }
  dispatch(
    addMeasurementDrawed({
      coordinates: tooltipCoordinates,
      distanceUnit: distanceUnit || DistanceUnit.NAUTICAL,
      feature: getGeoJSONFromFeature<Record<string, string>>(feature),
      measurement
    })
  )
}
