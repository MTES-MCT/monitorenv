import { OPENLAYERS_PROJECTION } from '@mtes-mct/monitor-ui'
import GeoJSON from 'ol/format/GeoJSON'
import Circle from 'ol/geom/Circle'
import { fromCircle } from 'ol/geom/Polygon'
import { batch } from 'react-redux'

import { DistanceUnit } from '../../entities/map/constants'
import { addMeasurementDrawed, resetCircleMeasurementInDrawing } from '../../shared_slices/Measurement'

export const saveMeasurement = (feature, measurement) => (dispatch, getState) => {
  const { distanceUnit } = getState().map

  feature.setId(feature.ol_uid)

  if (feature.getGeometry() instanceof Circle) {
    feature.setGeometry(fromCircle(feature.getGeometry()))
  }

  const geoJSONFeature = getGeoJSONFromFeature(feature)

  const tooltipCoordinates = feature.getGeometry().getLastCoordinate()
  batch(() => {
    dispatch(
      addMeasurementDrawed({
        coordinates: tooltipCoordinates,
        distanceUnit: distanceUnit || DistanceUnit.NAUTICAL,
        feature: geoJSONFeature,
        measurement
      })
    )
    resetCircleMeasurementInDrawing()
  })
}

function getGeoJSONFromFeature(feature) {
  const parser = new GeoJSON()

  return parser.writeFeatureObject(feature, { featureProjection: OPENLAYERS_PROJECTION })
}
