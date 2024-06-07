import { updateCurrentInterestPoint, type InterestPointState } from '../slice'

import type { Dispatch } from 'redux'

export const updateNameAction =
  (name: string | undefined) => (dispatch: Dispatch, getState: () => { interestPoint: InterestPointState }) => {
    const { currentInterestPoint }: InterestPointState = getState().interestPoint

    if (currentInterestPoint?.name !== name) {
      const updatedName = name === undefined ? null : name

      const { name: currentName, ...currentInterestPointWithoutName } = currentInterestPoint

      dispatch(updateCurrentInterestPoint({ name: updatedName, ...currentInterestPointWithoutName }))
    }
  }
