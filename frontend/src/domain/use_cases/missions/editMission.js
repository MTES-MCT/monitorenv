import { generatePath } from 'react-router'

import { sideWindowActions } from '../../../features/SideWindow/slice'
import { sideWindowPaths } from '../../entities/sideWindow'
import { setSelectedMissionsIds } from '../../shared_slices/MultiMissionsState'

export const editMission = missionId => dispatch => {
  dispatch(setSelectedMissionsIds({ id: missionId, type: 'edit' }))
  dispatch(sideWindowActions.focusAndGoTo(generatePath(sideWindowPaths.MISSION, { id: missionId })))
}
