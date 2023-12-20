import { generatePath } from 'react-router'

import { missionFormsActions, type MissionInStateType } from '../../../features/missions/MissionForm/slice'
import { removeMissionListener } from '../../../features/missions/MissionForm/sse'
import { missionActions } from '../../../features/missions/slice'
import { sideWindowActions } from '../../../features/SideWindow/slice'
import { getIdTyped } from '../../../utils/getIdTyped'
import { getMissionPageRoute } from '../../../utils/routes'
import { sideWindowPaths } from '../../entities/sideWindow'

export const deleteTab = (path: string) => async (dispatch, getState) => {
  const { missions } = getState().missionForms

  const routeParams = getMissionPageRoute(path)
  const indexToDelete = getIdTyped(routeParams?.params.id)

  if (indexToDelete && missions[indexToDelete]?.isFormDirty) {
    const missionToClose = missions[indexToDelete]
    await dispatch(missionFormsActions.setMission(missionToClose))
    await dispatch(missionActions.setSelectedMissionIdOnMap(missionToClose.id))

    await dispatch(sideWindowActions.setShowConfirmCancelModal(true))
    await dispatch(
      sideWindowActions.setCurrentPath(
        generatePath(sideWindowPaths.MISSION, {
          id: String(indexToDelete)
        })
      )
    )

    return
  }

  await dispatch(missionFormsActions.deleteSelectedMission(indexToDelete))
  if (typeof indexToDelete === 'number') {
    removeMissionListener(Number(indexToDelete))
  }

  const arrayOfMissions: MissionInStateType[] = Object.values(missions)
  const missionIndexToDelete = arrayOfMissions.findIndex(mission => mission?.missionForm?.id === indexToDelete)

  if (missionIndexToDelete === 0) {
    dispatch(sideWindowActions.setCurrentPath(generatePath(sideWindowPaths.MISSIONS)))
  } else {
    const previousMission = arrayOfMissions[missionIndexToDelete - 1]
    dispatch(
      sideWindowActions.setCurrentPath(
        generatePath(sideWindowPaths.MISSION, {
          id: previousMission?.missionForm.id
        })
      )
    )
  }
}
