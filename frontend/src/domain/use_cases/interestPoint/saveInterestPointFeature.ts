import Feature from 'ol/Feature'
import GeoJSON from 'ol/format/GeoJSON'
import Point from 'ol/geom/Point'

import { OPENLAYERS_PROJECTION } from '../../entities/map/constants'
import { updateInterestPointKeyBeingDrawed } from '../../shared_slices/InterestPoint'

export const saveInterestPointFeature = (feature?: Feature | undefined) => (dispatch, getState) => {
  const { interestPointBeingDrawed } = getState().interestPoint

  if (interestPointBeingDrawed?.feature) {
    return
  }

  const featureToSave =
    feature ||
    new Feature({
      geometry: new Point(interestPointBeingDrawed.coordinates),
      properties: interestPointBeingDrawed
    })

  featureToSave.setId(interestPointBeingDrawed.uuid)
  featureToSave.setProperties(interestPointBeingDrawed)

  const geoJSONFeature = getGeoJSONFromFeature(featureToSave)

  dispatch(
    updateInterestPointKeyBeingDrawed({
      key: 'feature',
      value: geoJSONFeature
    })
  )
}

function getGeoJSONFromFeature(feature) {
  const parser = new GeoJSON()

  return parser.writeFeatureObject(feature, { featureProjection: OPENLAYERS_PROJECTION })
}
