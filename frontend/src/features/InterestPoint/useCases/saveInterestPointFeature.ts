import { updateCurrentInterestPoint, type InterestPointState } from '@features/InterestPoint/slice'
import { getGeoJSONFromFeature } from 'domain/types/map'
import Feature from 'ol/Feature'
import { Point, type LineString } from 'ol/geom'

import type { Dispatch } from 'redux'

export const saveInterestPointFeature =
  (feature?: Feature) => (dispatch: Dispatch, getState: () => { interestPoint: InterestPointState }) => {
    const { currentInterestPoint } = getState().interestPoint

    if (!currentInterestPoint.coordinates) {
      return
    }

    const { feature: currentFeature, ...currentInterestPointWithoutFeature } = currentInterestPoint
    const featureToSave =
      feature ??
      new Feature({
        geometry: new Point(currentInterestPoint.coordinates),
        properties: currentInterestPointWithoutFeature
      })
    featureToSave.setId(currentInterestPoint.uuid)

    // FIXME: remove force cast
    const geoJSONFeature = getGeoJSONFromFeature(featureToSave) as unknown as Feature<LineString>

    dispatch(updateCurrentInterestPoint({ feature: geoJSONFeature, ...currentInterestPointWithoutFeature }))
  }
