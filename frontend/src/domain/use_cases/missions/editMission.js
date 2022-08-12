import { generatePath } from 'react-router'
import { sideWindowPaths, sideWindowMenu } from '../../entities/sideWindow'
import { openSideWindowTab } from '../../shared_slices/Global'
import { setSideWindowPath } from '../../../features/commonComponents/SideWindowRouter/SideWindowRouter.slice'
import { setMissionIdBeingEdited } from '../../shared_slices/MissionsState'



export const editMission = (missionId) => (dispatch) => {
  dispatch(openSideWindowTab(sideWindowMenu.MISSIONS.code))
  dispatch(setMissionIdBeingEdited(missionId))
  dispatch(setSideWindowPath(generatePath(sideWindowPaths.MISSION, {id: missionId})))
}

