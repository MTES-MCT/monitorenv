import { SideWindowStatus, sideWindowActions } from '../../../features/SideWindow/slice'

export const onNavigate = (path: string) => (dispatch, getState) => {
  const {
    draw: { listener },
    missionState: { isFormDirty, missionState },
    sideWindow
  } = getState()

  if ((sideWindow.status === SideWindowStatus.HIDDEN && missionState && !listener && isFormDirty) || isFormDirty) {
    return dispatch(sideWindowActions.onFocusAndDisplayCancelModal(path))
  }

  return dispatch(sideWindowActions.focusAndGoTo(path))
}
