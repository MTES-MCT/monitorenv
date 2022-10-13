import { generatePath } from 'react-router'

import { setSideWindowPath } from '../../../components/SideWindowRouter/SideWindowRouter.slice'
import { sideWindowPaths, sideWindowMenu } from '../../entities/sideWindow'
import { openSideWindowTab } from '../../shared_slices/Global'

export const editMission = missionId => dispatch => {
  dispatch(openSideWindowTab(sideWindowMenu.MISSIONS.code))
  dispatch(setSideWindowPath(generatePath(sideWindowPaths.MISSION, { id: missionId })))
}
