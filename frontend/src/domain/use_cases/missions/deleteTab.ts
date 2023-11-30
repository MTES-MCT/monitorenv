import { generatePath } from 'react-router'

import { removeMissionListener } from '../../../features/missions/MissionForm/sse'
import { sideWindowActions } from '../../../features/SideWindow/slice'
import { getIdTyped } from '../../../utils/getIdTyped'
import { getMissionPageRoute } from '../../../utils/routes'
import { sideWindowPaths } from '../../entities/sideWindow'
import { multiMissionsActions } from '../../shared_slices/MultiMissions'

export const deleteTab = (nextPath: string) => async (dispatch, getState) => {
  const {
    missionState: { isFormDirty, missionState },
    multiMissions: { selectedMissions }
  } = getState()

  const routeParams = getMissionPageRoute(nextPath)
  const id = getIdTyped(routeParams?.params.id)

  const indexToDelete = selectedMissions.findIndex(mission => mission.mission.id === id)

  // if we want to close the tab with a form that has changes
  if (
    selectedMissions[indexToDelete]?.isFormDirty ||
    (selectedMissions.length === 1 && isFormDirty) ||
    (selectedMissions[indexToDelete].mission?.id === missionState?.id && isFormDirty)
  ) {
    if (missionState) {
      await saveCurrentMissionInMultiMissionsState(missionState, selectedMissions, isFormDirty, dispatch)
    }

    dispatch(sideWindowActions.setShowConfirmCancelModal(true))
    dispatch(
      sideWindowActions.setCurrentPath(
        generatePath(sideWindowPaths.MISSION, {
          id: String(id)
        })
      )
    )

    return
  }

  await dispatch(multiMissionsActions.deleteSelectedMission(id))
  if (typeof id === 'number') {
    removeMissionListener(Number(id))
  }

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

async function saveCurrentMissionInMultiMissionsState(missionState, selectedMissions, isFormDirty, dispatch) {
  const updatedMissions = [...selectedMissions]
  const missionIndex = updatedMissions.findIndex(mission => mission.mission.id === missionState?.id)
  const missionFormatted = {
    isFormDirty,
    mission: missionState
  }
  if (missionIndex !== -1) {
    updatedMissions[missionIndex] = missionFormatted
  } else {
    updatedMissions.push(missionFormatted)
  }
  await dispatch(multiMissionsActions.setSelectedMissions(updatedMissions))
}
