import { type InterestPointState, updateInterestPointByProperty } from '@features/InterestPoint/slice'
import { getGeoJSONFromFeature } from 'domain/types/map'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'

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
    updateInterestPointByProperty({
      key: 'feature',
      value: geoJSONFeature
    })
  )
}
