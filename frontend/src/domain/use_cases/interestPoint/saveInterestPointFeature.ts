import { getGeoJSONFromFeature } from 'domain/types/map'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'

import { updateInterestPointKeyBeingDrawed } from '../../shared_slices/InterestPoint'

export const saveInterestPointFeature = (feature?: Feature | undefined) => (dispatch, getState) => {
  const { interestPointBeingDrawed } = getState().interestPoint

  if (interestPointBeingDrawed?.feature) {
    return
  }

  const featureToSave =
    feature ??
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
