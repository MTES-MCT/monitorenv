import { updateCurrentInterestPoint, type InterestPointState } from '../slice'

export const updateNameAction = (name: string | undefined) => (dispatch, getState) => {
  const { currentInterestPoint }: InterestPointState = getState().interestPoint

  if (currentInterestPoint?.name !== name) {
    const updatedName = name === undefined ? null : name

    const { name: currentName, ...currentInterestPointWithoutName } = currentInterestPoint

    dispatch(updateCurrentInterestPoint({ name: updatedName, ...currentInterestPointWithoutName }))
  }
}
