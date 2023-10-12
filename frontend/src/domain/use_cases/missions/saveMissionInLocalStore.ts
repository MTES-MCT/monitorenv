import { multiMissionsActions } from '../../shared_slices/MultiMissions'

export const saveMissionInLocalStore = () => async (dispatch, getState) => {
  const {
    missionState: { isFormDirty, missionState },
    multiMissions: { selectedMissions }
  } = getState()
  if (!missionState) {
    return
  }

  const missionsUpdated = [...selectedMissions]
  const missionIndex = missionsUpdated.findIndex(mission => mission.mission.id === missionState?.id)

  // We want to save the active form before navigate to another page in side window
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
