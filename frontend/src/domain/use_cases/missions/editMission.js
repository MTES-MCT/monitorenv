import { generatePath } from 'react-router'

import { setSideWindowPath, openSideWindowTab } from '../../../components/SideWindowRouter/SideWindowRouter.slice'
import { sideWindowPaths, sideWindowMenu } from '../../entities/sideWindow'

export const editMission = missionId => dispatch => {
  dispatch(openSideWindowTab(sideWindowMenu.MISSIONS.code))
  dispatch(setSideWindowPath(generatePath(sideWindowPaths.MISSION, { id: missionId })))
}
