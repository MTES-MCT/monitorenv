import { generatePath } from 'react-router'
import { sideWindowPaths, sideWindowMenu } from '../entities/sideWindow'
import { openSideWindowTab } from '../../domain/shared_slices/Global'
import { setSideWindowPath } from '../../features/commonComponents/SideWindowRouter/SideWindowRouter.slice'
import { setSelectedMissionId } from '../shared_slices/MissionsState'


export const selectMissionOnMap = (missionId) => (dispatch) => {
  dispatch(setSelectedMissionId(missionId))
  dispatch(openSideWindowTab(sideWindowMenu.MISSIONS.code))
  dispatch(setSideWindowPath(generatePath(sideWindowPaths.MISSION, {id: missionId})))
}