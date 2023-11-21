import { missionsAPI } from '../../../api/missionsAPI'
import { attachMissionToReportingSliceActions } from '../../../features/Reportings/ReportingForm/AttachMission/slice'
import { setToast } from '../../shared_slices/Global'

export const attachMission = (id: number) => async (dispatch, getState) => {
  const { missionId } = getState().attachMissionToReporting

  if (missionId === id) {
    return
  }

  const response = dispatch(missionsAPI.endpoints.getMission.initiate(id))

  response
    .then(async result => {
      if (!result.data) {
        throw Error("Erreur à l'ajout du signalement")
      }
      await dispatch(attachMissionToReportingSliceActions.setAttachedMission(result.data))
      await dispatch(attachMissionToReportingSliceActions.setMissionId(id))
      response.unsubscribe()
    })
    .catch(error => {
      dispatch(setToast({ containerId: 'sideWindow', message: error }))
    })
}
