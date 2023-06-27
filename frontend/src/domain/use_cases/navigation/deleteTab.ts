import { generatePath } from 'react-router'

import { sideWindowActions } from '../../../features/SideWindow/slice'
import { getMissionPageRoute } from '../../../utils/getMissionPageRoute'
import { sideWindowPaths } from '../../entities/sideWindow'
import { setMissionState } from '../../shared_slices/MissionsState'
import { multiMissionsActions } from '../../shared_slices/MultiMissions'

export const deleteTab = nextPath => async (dispatch, getState) => {
  const {
    missionState: { isFormDirty },
    multiMissions: { selectedMissions },
    sideWindow: { currentPath }
  } = getState()

  const routeParams = getMissionPageRoute(nextPath as string)
  const id =
    routeParams?.params.id && routeParams?.params.id.includes('new-')
      ? routeParams?.params.id
      : parseInt(routeParams?.params.id || '', 10)
  const indexToDelete = selectedMissions.findIndex(mission => mission.mission.id === id)

  // We want to close the tab with a form that has changes
  if (selectedMissions[indexToDelete]?.isFormDirty || (selectedMissions.length === 1 && isFormDirty)) {
    dispatch(setMissionState(selectedMissions[indexToDelete]?.mission))
    dispatch(sideWindowActions.setShowConfirmCancelModal(true))
    dispatch(
      sideWindowActions.setCurrentPath(
        generatePath(sideWindowPaths.MISSION, {
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
          generatePath(sideWindowPaths.MISSION, {
            id: previousMission?.mission.id
          })
        )
      )
    }
  }
}
