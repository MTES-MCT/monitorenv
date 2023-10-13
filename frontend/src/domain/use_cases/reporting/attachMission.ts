import { missionsAPI } from '../../../api/missionsAPI'
import { attachMissionToReportingSliceActions } from '../../../features/Reportings/ReportingForm/AttachMission/slice'
import { setToast } from '../../shared_slices/Global'

export const attachMission = (id: number) => async (dispatch, getState) => {
  const { missionId } = getState().attachMissionToReporting

  try {
    if (missionId === id) {
      return
    }

    const response = await dispatch(missionsAPI.endpoints.getMission.initiate(id))
    if ('error' in response) {
      throw Error("Erreur à l'ajout du signalement")
    } else {
      dispatch(attachMissionToReportingSliceActions.setAttachedMission(response.data))
      dispatch(attachMissionToReportingSliceActions.setMissionId(id))
    }
  } catch (error) {
    dispatch(setToast({ containerId: 'sideWindow', message: error }))
  }
}
