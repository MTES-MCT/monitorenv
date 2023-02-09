import { generatePath } from 'react-router'

import { sideWindowActions } from '../../../features/SideWindow/slice'
import { sideWindowPaths } from '../../entities/sideWindow'

export const editMission = missionId => dispatch => {
  dispatch(sideWindowActions.openAndGoTo(generatePath(sideWindowPaths.MISSION, { id: missionId })))
}
