import { generatePath } from 'react-router'

import { sideWindowActions } from '../../../features/SideWindow/slice'
import { getIdTyped } from '../../../utils/getIdTyped'
import { getMissionPageRoute } from '../../../utils/routes'
import { sideWindowPaths } from '../../entities/sideWindow'
import { multiMissionsActions } from '../../shared_slices/MultiMissions'

export const deleteTab = nextPath => async (dispatch, getState) => {
  const {
    missionState: { isFormDirty, missionState },
    multiMissions: { selectedMissions }
  } = getState()

  const routeParams = getMissionPageRoute(nextPath as string)
  const id = getIdTyped(routeParams?.params.id)

  const indexToDelete = selectedMissions.findIndex(mission => mission.mission.id === id)

  // if we want to close the tab with a form that has changes
  if (
    selectedMissions[indexToDelete]?.isFormDirty ||
    (selectedMissions.length === 1 && isFormDirty) ||
    (selectedMissions[indexToDelete].mission?.id === missionState?.id && isFormDirty)
  ) {
    if (missionState) {
      const missionsUpdated = [...selectedMissions]
      const missionIndex = missionsUpdated.findIndex(mission => mission.mission.id === missionState?.id)
      const missionFormatted = {
        isFormDirty,
        mission: missionState
      }
      if (missionIndex !== -1) {
        missionsUpdated[missionIndex] = missionFormatted
      } else {
        missionsUpdated.push(missionFormatted)
      }
      await dispatch(multiMissionsActions.setSelectedMissions(missionsUpdated))
    }

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

  await dispatch(multiMissionsActions.deleteSelectedMission(id))

  if (indexToDelete === 0) {
    dispatch(sideWindowActions.setCurrentPath(generatePath(sideWindowPaths.MISSIONS)))
  } else {
    const previousMission = selectedMissions[indexToDelete - 1]
    dispatch(
      sideWindowActions.setCurrentPath(
        generatePath(sideWindowPaths.MISSION, {
          id: previousMission?.mission.id
        })
      )
    )
  }
}
