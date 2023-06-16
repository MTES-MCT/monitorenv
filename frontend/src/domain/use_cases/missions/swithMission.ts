import { matchPath } from 'react-router'

import { sideWindowActions } from '../../../features/SideWindow/slice'
import { sideWindowPaths } from '../../entities/sideWindow'
import { setMissionState, setSelectedMissionId } from '../../shared_slices/MissionsState'
import { setMultiMissionsState } from '../../shared_slices/MultiMissionsState'

export const switchMission = path => (dispatch, getState) => {
  const {
    missionState: { missionState },
    multiMissionsState: { multiMissionsState },
    sideWindow: { currentPath }
  } = getState()
  const listRouteParams = matchPath(
    {
      end: true,
      path: sideWindowPaths.MISSIONS
    },
    currentPath as string
  )
  const editRouteParams = matchPath<'id', string>(
    {
      end: true,
      path: sideWindowPaths.MISSION
    },
    path as string
  )
  const newRouteParams = matchPath<'id', string>(
    {
      end: true,
      path: sideWindowPaths.MISSION_NEW
    },
    path as string
  )

  const id = Number(editRouteParams?.params.id) || Number(newRouteParams?.params.id)

  if (!listRouteParams) {
    const missionsUpdated = [...multiMissionsState]
    const missionIndex = missionsUpdated.findIndex(mission => mission.id === id)
    if (missionIndex !== -1) {
      missionsUpdated[missionIndex] = missionState
    } else {
      missionsUpdated.push(missionState)
    }
    dispatch(setMultiMissionsState(missionsUpdated))
  }

  if (!Number.isNaN(id)) {
    const newSelectedMission = multiMissionsState.find(mission => mission.id === id)
    if (newSelectedMission) {
      dispatch(setSelectedMissionId(newSelectedMission.id))
      dispatch(setMissionState(newSelectedMission))
    }
  }
  dispatch(sideWindowActions.setCurrentPath(path))
}
