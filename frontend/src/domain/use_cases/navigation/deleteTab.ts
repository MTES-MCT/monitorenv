import { generatePath } from 'react-router'

import { sideWindowActions } from '../../../features/SideWindow/slice'
import { editMissionPageRoute, newMissionPageRoute } from '../../../utils/isEditOrNewMissionPage'
import { sideWindowPaths } from '../../entities/sideWindow'
import { setMissionState } from '../../shared_slices/MissionsState'
import { multiMissionsActions } from '../../shared_slices/MultiMissions'

export const deleteTab = nextPath => async (dispatch, getState) => {
  const {
    missionState: { isFormDirty },
    multiMissions: { selectedMissions },
    sideWindow: { currentPath }
  } = getState()

  const editRouteParams = editMissionPageRoute(nextPath as string)
  const newRouteParams = newMissionPageRoute(nextPath as string)
  const id = Number(editRouteParams?.params.id) || Number(newRouteParams?.params.id)

  const indexToDelete = selectedMissions.findIndex(mission => mission.mission.id === id)

  // We want to close the tab with a form that has changes
  if (selectedMissions[indexToDelete]?.isFormDirty || (selectedMissions.length === 1 && isFormDirty)) {
    dispatch(setMissionState(selectedMissions[indexToDelete]?.mission))
    dispatch(sideWindowActions.setShowConfirmCancelModal(true))
    dispatch(
      sideWindowActions.setCurrentPath(
        generatePath(newRouteParams ? sideWindowPaths.MISSION_NEW : sideWindowPaths.MISSION, {
          id: selectedMissions[indexToDelete]?.mission.id
        })
      )
    )

    return
  }

  dispatch(multiMissionsActions.deleteSelectedMission(id))

  // We want to close the tab with a form that has no changes
  if (nextPath === currentPath) {
    // we want to redirect to missions list
    if (indexToDelete === 0) {
      dispatch(setMissionState(undefined))
      dispatch(sideWindowActions.setCurrentPath(generatePath(sideWindowPaths.MISSIONS)))
    } else {
      const previousMission = selectedMissions[indexToDelete - 1]
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
