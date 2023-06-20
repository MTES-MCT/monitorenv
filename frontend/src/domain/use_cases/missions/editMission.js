import { generatePath } from 'react-router'

import { sideWindowActions } from '../../../features/SideWindow/slice'
import { sideWindowPaths } from '../../entities/sideWindow'
import { setMultiMissionsState } from '../../shared_slices/MultiMissionsState'

export const editMission = row => (dispatch, getState) => {
  const {
    multiMissionsState: { multiMissionsState }
  } = getState()

  const {
    original: { id }
  } = row

  const missionToEdit = {
    mission: row.original,
    type: 'edit'
  }
  const missions = [...multiMissionsState]
  const missionIndex = missions.findIndex(mission => mission.mission.id === id)
  if (missionIndex !== -1) {
    missions[missionIndex] = missionToEdit
  } else {
    missions.push(missionToEdit)
  }

  dispatch(setMultiMissionsState(missions))
  dispatch(sideWindowActions.focusAndGoTo(generatePath(sideWindowPaths.MISSION, { id })))
}
