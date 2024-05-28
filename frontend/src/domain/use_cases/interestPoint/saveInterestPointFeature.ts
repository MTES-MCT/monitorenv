import { getGeoJSONFromFeature } from 'domain/types/map'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'

import { updateCurrentInterestPointProperty, type InterestPointState } from '../../shared_slices/InterestPoint'

export const saveInterestPointFeature = (feature?: Feature | undefined) => (dispatch, getState) => {
  const { currentInterestPoint }: InterestPointState = getState().interestPoint

  if (currentInterestPoint?.feature) {
    return
  }

  const featureToSave =
    feature ??
    new Feature({
      geometry: new Point(currentInterestPoint?.coordinates!),
      properties: currentInterestPoint
    })

  featureToSave.setId(currentInterestPoint?.uuid)

  const geoJSONFeature = getGeoJSONFromFeature(featureToSave)

  dispatch(
    updateCurrentInterestPointProperty({
      key: 'feature',
      value: geoJSONFeature
    })
  )
}
