import { sideWindowActions } from '../../../features/SideWindow/slice'
import { editMissionPageRoute, newMissionPageRoute } from '../../../utils/isEditOrNewMissionPage'
import { setMissionState } from '../../shared_slices/MissionsState'
import { setMultiMissionsState } from '../../shared_slices/MultiMissionsState'

export const switchTab = path => async (dispatch, getState) => {
  const {
    missionState: { isFormDirty, missionState },
    multiMissionsState: { multiMissionsState }
  } = getState()

  const newMissionPage = newMissionPageRoute(path)
  const editMissionPage = editMissionPageRoute(path)
  const id = Number(newMissionPage?.params.id) || Number(editMissionPage?.params.id) || undefined
  const missionsUpdated = [...multiMissionsState]
  const missionIndex = missionsUpdated.findIndex(mission =>
    missionState ? mission.mission.id === missionState?.id : mission.mission.id === id
  )

  if (missionState) {
    const missionFormatted = {
      isFormDirty,
      mission: missionState,
      type: missionsUpdated[missionIndex].type
    }
    if (missionIndex !== -1) {
      missionsUpdated[missionIndex] = missionFormatted
    } else {
      missionsUpdated.push(missionFormatted)
    }
  }

  const newSelectedMission = multiMissionsState.find(mission => mission.mission.id === id)
  if (newSelectedMission) {
    await dispatch(setMissionState(newSelectedMission.mission))
  }

  await dispatch(setMultiMissionsState(missionsUpdated))
  await dispatch(sideWindowActions.setCurrentPath(path))
}
