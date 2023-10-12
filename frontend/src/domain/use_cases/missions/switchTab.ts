import { sideWindowActions } from '../../../features/SideWindow/slice'
import { getIdTyped } from '../../../utils/getIdTyped'
import { getMissionPageRoute } from '../../../utils/routes'
import { multiMissionsActions } from '../../shared_slices/MultiMissions'

export const switchTab = path => async (dispatch, getState) => {
  const {
    missionState: { isFormDirty, missionState },
    multiMissions: { selectedMissions }
  } = getState()

  const routeParams = getMissionPageRoute(path)
  const id = getIdTyped(routeParams?.params.id)

  const missionsUpdated = [...selectedMissions]
  const missionIndex = missionsUpdated.findIndex(mission =>
    missionState ? mission.mission.id === missionState?.id : mission.mission.id === id
  )

  // We want to save the active form before switching on another
  if (missionState && selectedMissions.length > 0) {
    const missionFormatted = {
      isFormDirty,
      mission: missionState
    }
    if (missionIndex !== -1) {
      missionsUpdated[missionIndex] = missionFormatted
    } else {
      missionsUpdated.push(missionFormatted)
    }
  }

  await dispatch(multiMissionsActions.setSelectedMissions(missionsUpdated))
  await dispatch(sideWindowActions.setCurrentPath(path))
}
