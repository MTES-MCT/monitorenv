import { setSelectedMissionId } from '../../shared_slices/MissionsState'

export const selectMissionOnMap = (missionId) => (dispatch) => {
  dispatch(setSelectedMissionId(missionId))
}
export const clearSelectedMissionOnMap = () => (dispatch) => {
  dispatch(setSelectedMissionId(null))
}
