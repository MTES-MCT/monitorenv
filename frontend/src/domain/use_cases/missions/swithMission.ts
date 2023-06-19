import { sideWindowActions } from '../../../features/SideWindow/slice'
import { editMissionPageRoute, newMissionPageRoute } from '../../../utils/isEditOrNewMissionPage'
import { setMissionState, setSelectedMissionId } from '../../shared_slices/MissionsState'
import { setMultiMissionsState } from '../../shared_slices/MultiMissionsState'

export const switchMission = path => async (dispatch, getState) => {
  const {
    missionState: { missionState },
    multiMissionsState: { multiMissionsState }
  } = getState()

  const newMissionPage = newMissionPageRoute(path)
  const editMissionPage = editMissionPageRoute(path)
  const id = Number(newMissionPage?.params.id) || Number(editMissionPage?.params.id) || undefined
  const missionsUpdated = [...multiMissionsState]
  const missionIndex = missionsUpdated.findIndex(mission =>
    missionState ? mission.id === missionState?.id : mission.id === id
  )
  if (missionState) {
    if (missionIndex !== -1) {
      missionsUpdated[missionIndex] = missionState
    } else {
      missionsUpdated.push(missionState)
    }
  }

  const newSelectedMission = multiMissionsState.find(mission => mission.id === id)
  if (newSelectedMission) {
    await dispatch(setSelectedMissionId(newSelectedMission.id))
    await dispatch(setMissionState(newSelectedMission))
  }

  await dispatch(setMultiMissionsState(missionsUpdated))
  await dispatch(sideWindowActions.setCurrentPath(path))
}
