import { updateCurrentInterestPoint, type InterestPointState } from '../slice'

export const updateObservationsAction = (observations: string | undefined) => (dispatch, getState) => {
  const { currentInterestPoint }: InterestPointState = getState().interestPoint

  if (currentInterestPoint?.observations !== observations) {
    const updatedObservations = observations === undefined ? null : observations
    const { observations: currentObservations, ...currentInterestPointWithoutObservations } = currentInterestPoint

    dispatch(
      updateCurrentInterestPoint({ observations: updatedObservations, ...currentInterestPointWithoutObservations })
    )
  }
}
