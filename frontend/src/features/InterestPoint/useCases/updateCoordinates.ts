import { OPENLAYERS_PROJECTION, WSG84_PROJECTION, coordinatesAreDistinct } from '@mtes-mct/monitor-ui'
import { transform } from 'ol/proj'

import { updateCurrentInterestPoint, type InterestPointState } from '../slice'

import type { Dispatch } from 'redux'

export const updateCoordinatesAction =
  (nextCoordinates, previousCoordinates) =>
  (dispatch: Dispatch, getState: () => { interestPoint: InterestPointState }) => {
    const { currentInterestPoint }: InterestPointState = getState().interestPoint
    if (nextCoordinates?.length) {
      if (!previousCoordinates?.length || coordinatesAreDistinct(nextCoordinates, previousCoordinates)) {
        const [latitude, longitude] = nextCoordinates
        if (!latitude || !longitude) {
          return
        }

        // Convert to [longitude, latitude] and OpenLayers projection
        const updatedCoordinates = transform([longitude, latitude], WSG84_PROJECTION, OPENLAYERS_PROJECTION)
        const { coordinates: currentCoordinates, ...currentInterestPointWithoutCoordinates } = currentInterestPoint

        dispatch(
          updateCurrentInterestPoint({ coordinates: updatedCoordinates, ...currentInterestPointWithoutCoordinates })
        )
      }
    }
  }
