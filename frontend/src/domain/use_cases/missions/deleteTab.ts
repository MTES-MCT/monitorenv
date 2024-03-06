import { generatePath } from 'react-router'

import { attachReportingToMissionSliceActions } from '../../../features/missions/MissionForm/AttachReporting/slice'
import { missionFormsActions, type MissionInStateType } from '../../../features/missions/MissionForm/slice'
import { missionActions } from '../../../features/missions/slice'
import { sideWindowActions } from '../../../features/SideWindow/slice'
import { getIdTyped } from '../../../utils/getIdTyped'
import { getMissionPageRoute } from '../../../utils/routes'
import { sideWindowPaths } from '../../entities/sideWindow'

export const deleteTab =
  (path: string, forceQuitAndRedirectToList = false) =>
  async (dispatch, getState) => {
    const { missions } = getState().missionForms
    const { activeMissionId } = getState().missionForms
    const { selectedMissionIdOnMap } = getState().mission

    const routeParams = getMissionPageRoute(path)
    const idToDelete = getIdTyped(routeParams?.params.id)

    if (idToDelete && missions[idToDelete]?.isFormDirty && !forceQuitAndRedirectToList) {
      if (activeMissionId === idToDelete) {
        await dispatch(sideWindowActions.setShowConfirmCancelModal(true))

        return
      }
      const missionToClose = missions[idToDelete]
      await setMission(dispatch, missionToClose)
      await dispatch(sideWindowActions.setShowConfirmCancelModal(true))

      return
    }

    if (idToDelete === selectedMissionIdOnMap) {
      await dispatch(missionActions.resetSelectedMissionIdOnMap())
    }

    if (idToDelete === activeMissionId) {
      await dispatch(attachReportingToMissionSliceActions.resetAttachReportingState())
    }

    await dispatch(missionFormsActions.deleteSelectedMission(idToDelete))

    const arrayOfMissions: MissionInStateType[] = Object.values(missions)
    const missionToDeleteIndex = arrayOfMissions.findIndex(mission => mission?.missionForm?.id === idToDelete)

    if (missionToDeleteIndex === 0 || forceQuitAndRedirectToList) {
      dispatch(sideWindowActions.setCurrentPath(generatePath(sideWindowPaths.MISSIONS)))
    } else {
      const previousMission = arrayOfMissions[missionToDeleteIndex - 1]
      await setMission(dispatch, previousMission)
    }
  }

async function setMission(dispatch, mission) {
  await dispatch(missionFormsActions.setMission(mission))
  await dispatch(missionActions.setSelectedMissionIdOnMap(mission.missionForm.id))
  await dispatch(
    attachReportingToMissionSliceActions.setAttachedReportings(mission.missionForm.attachedReportings || [])
  )
  await dispatch(sideWindowActions.focusAndGoTo(generatePath(sideWindowPaths.MISSION, { id: mission.missionForm.id })))
}
