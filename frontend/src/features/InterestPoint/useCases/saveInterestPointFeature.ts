import { updateCurrentInterestPoint, type InterestPointState } from '@features/InterestPoint/slice'
import { getGeoJSONFromFeature } from 'domain/types/map'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'

import type { LineString } from 'ol/geom'

export const saveInterestPointFeature = (feature?: Feature | undefined) => (dispatch, getState) => {
  const { currentInterestPoint }: InterestPointState = getState().interestPoint

  if (currentInterestPoint?.feature || !currentInterestPoint.coordinates) {
    return
  }

  const featureToSave =
    feature ??
    new Feature({
      geometry: new Point(currentInterestPoint.coordinates),
      properties: currentInterestPoint
    })

  featureToSave.setId(currentInterestPoint?.uuid)

  // FIXME: had to force cast
  const geoJSONFeature = getGeoJSONFromFeature(featureToSave) as unknown as Feature<LineString>

  const { feature: currentFeature, ...currentInterestPointWithoutFeature } = currentInterestPoint

  dispatch(updateCurrentInterestPoint({ feature: geoJSONFeature, ...currentInterestPointWithoutFeature }))
}
