import { SideWindowStatus, sideWindowActions } from '../../../features/SideWindow/slice'

export const onNavigateBetweenMapAndSideWindow = (path: string) => (dispatch, getState) => {
  const { sideWindow } = getState()
  const { missionState } = getState().missionState
  const { listener } = getState().draw

  if (sideWindow.status === SideWindowStatus.HIDDEN && missionState && !listener) {
    return dispatch(sideWindowActions.onFocusAndDisplayCancelModal(path))
  }

  return dispatch(sideWindowActions.focusAndGoTo(path))
}
