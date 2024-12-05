import { updateCurrentInterestPoint, type InterestPointState } from '../slice'

import type { Dispatch } from 'redux'

export const updateObservationsAction =
  (observations: string | undefined) => (dispatch: Dispatch, getState: () => { interestPoint: InterestPointState }) => {
    const { currentInterestPoint }: InterestPointState = getState().interestPoint

    if (currentInterestPoint?.observations !== observations) {
      const { observations: currentObservations, ...currentInterestPointWithoutObservations } = currentInterestPoint

      dispatch(updateCurrentInterestPoint({ observations, ...currentInterestPointWithoutObservations }))
    }
  }
