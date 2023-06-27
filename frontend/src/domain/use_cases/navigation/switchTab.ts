import { sideWindowActions } from '../../../features/SideWindow/slice'
import { getMissionPageRoute } from '../../../utils/getMissionPageRoute'
import { setMissionState } from '../../shared_slices/MissionsState'
import { multiMissionsActions } from '../../shared_slices/MultiMissions'

export const switchTab = path => async (dispatch, getState) => {
  const {
    missionState: { isFormDirty, missionState },
    multiMissions: { selectedMissions }
  } = getState()

  const routeParams = getMissionPageRoute(path)
  const id =
    routeParams?.params.id && routeParams?.params.id.includes('new-')
      ? routeParams?.params.id
      : parseInt(routeParams?.params.id || '', 10)
  const missionsUpdated = [...selectedMissions]
  const missionIndex = missionsUpdated.findIndex(mission =>
    missionState ? mission.mission.id === missionState?.id : mission.mission.id === id
  )

  // We want to save the active form before switching on another
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

  const newSelectedMission = selectedMissions.find(mission => mission.mission.id === id)
  if (newSelectedMission) {
    await dispatch(setMissionState(newSelectedMission.mission))
  }

  await dispatch(multiMissionsActions.setSelectedMissions(missionsUpdated))
  await dispatch(sideWindowActions.setCurrentPath(path))
}
