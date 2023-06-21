import { generatePath } from 'react-router'

import { sideWindowActions } from '../../../features/SideWindow/slice'
import { editMissionPageRoute, newMissionPageRoute } from '../../../utils/isEditOrNewMissionPage'
import { sideWindowPaths } from '../../entities/sideWindow'
import { setMissionState } from '../../shared_slices/MissionsState'
import { deleteMissionFromMultiMissionState } from '../../shared_slices/MultiMissionsState'

export const deleteTab = eventKey => async (dispatch, getState) => {
  const {
    missionState: { isFormDirty },
    multiMissionsState: { multiMissionsState },
    sideWindow: { currentPath }
  } = getState()

  const editRouteParams = editMissionPageRoute(eventKey as string)
  const newRouteParams = newMissionPageRoute(eventKey as string)
  const id = Number(editRouteParams?.params.id) || Number(newRouteParams?.params.id)

  const indexToDelete = multiMissionsState.findIndex(mission => mission.mission.id === id)

  if (multiMissionsState[indexToDelete]?.isFormDirty || isFormDirty) {
    dispatch(setMissionState(multiMissionsState[indexToDelete]?.mission))
    dispatch(sideWindowActions.setShowConfirmCancelModal(true))
    dispatch(
      sideWindowActions.setCurrentPath(
        generatePath(newRouteParams ? sideWindowPaths.MISSION_NEW : sideWindowPaths.MISSION, {
          id: multiMissionsState[indexToDelete]?.mission.id
        })
      )
    )

    return
  }

  dispatch(deleteMissionFromMultiMissionState(id))

  if (eventKey === currentPath) {
    // we want to redirect to missions list
    if (indexToDelete === 0) {
      dispatch(setMissionState(undefined))
      dispatch(sideWindowActions.setCurrentPath(generatePath(sideWindowPaths.MISSIONS)))
    } else {
      const previousMission = multiMissionsState[indexToDelete - 1]
      dispatch(setMissionState(previousMission.mission))
      dispatch(
        sideWindowActions.setCurrentPath(
          generatePath(previousMission.type === 'new' ? sideWindowPaths.MISSION_NEW : sideWindowPaths.MISSION, {
            id: previousMission?.mission.id
          })
        )
      )
    }
  }
}
