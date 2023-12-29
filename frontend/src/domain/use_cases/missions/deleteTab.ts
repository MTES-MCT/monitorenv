import { generatePath } from 'react-router'

import { attachReportingToMissionSliceActions } from '../../../features/missions/MissionForm/AttachReporting/slice'
import { missionFormsActions, type MissionInStateType } from '../../../features/missions/MissionForm/slice'
import { removeMissionListener } from '../../../features/missions/MissionForm/sse'
import { missionActions } from '../../../features/missions/slice'
import { sideWindowActions } from '../../../features/SideWindow/slice'
import { getIdTyped } from '../../../utils/getIdTyped'
import { isNewMission } from '../../../utils/isNewMission'
import { getMissionPageRoute } from '../../../utils/routes'
import { sideWindowPaths } from '../../entities/sideWindow'

export const deleteTab = (path: string) => async (dispatch, getState) => {
  const { missions } = getState().missionForms
  const { activeMissionId } = getState().missionForms
  const { selectedMissionIdOnMap } = getState().mission

  const routeParams = getMissionPageRoute(path)
  const idToDelete = getIdTyped(routeParams?.params.id)

  if (idToDelete && missions[idToDelete]?.isFormDirty) {
    if (activeMissionId === idToDelete) {
      await dispatch(sideWindowActions.setShowConfirmCancelModal(true))

      return
    }
    const missionToClose = missions[idToDelete]
    await dispatch(missionFormsActions.setMission(missionToClose))
    await dispatch(missionActions.setSelectedMissionIdOnMap(missionToClose.id))

    await dispatch(sideWindowActions.setShowConfirmCancelModal(true))

    await dispatch(
      sideWindowActions.setCurrentPath(
        generatePath(sideWindowPaths.MISSION, {
          id: String(idToDelete)
        })
      )
    )

    return
  }

  if (idToDelete === selectedMissionIdOnMap) {
    await dispatch(missionActions.resetSelectedMissionIdOnMap())
  }

  if (idToDelete === activeMissionId) {
    await dispatch(attachReportingToMissionSliceActions.resetAttachReportingState())
  }

  await dispatch(missionFormsActions.deleteSelectedMission(idToDelete))

  if (!isNewMission(idToDelete)) {
    removeMissionListener(Number(idToDelete))
  }

  const arrayOfMissions: MissionInStateType[] = Object.values(missions)
  const missionIdToDelete = arrayOfMissions.findIndex(mission => mission?.missionForm?.id === idToDelete)

  if (missionIdToDelete === 0) {
    dispatch(sideWindowActions.setCurrentPath(generatePath(sideWindowPaths.MISSIONS)))
  } else {
    const previousMission = arrayOfMissions[missionIdToDelete - 1]
    dispatch(
      sideWindowActions.setCurrentPath(
        generatePath(sideWindowPaths.MISSION, {
          id: previousMission?.missionForm.id
        })
      )
    )
  }
}
