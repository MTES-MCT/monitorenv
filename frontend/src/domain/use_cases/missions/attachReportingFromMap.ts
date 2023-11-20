import { reportingsAPI } from '../../../api/reportingsAPI'
import { attachReportingToMissionSliceActions } from '../../../features/missions/MissionForm/AttachReporting/slice'
import { setToast } from '../../shared_slices/Global'

export const attachReportingFromMap = (id: number) => async (dispatch, getState) => {
  const { attachedReportings } = getState().attachReportingToMission
  const { attachedReportingIds } = getState().attachReportingToMission
  const missionId = getState().missionState.missionState.id

  if (attachedReportingIds.includes(id)) {
    return
  }

  const response = dispatch(reportingsAPI.endpoints.getReporting.initiate(id))
  response
    .then(result => {
      if (result.data) {
        dispatch(
          attachReportingToMissionSliceActions.setAttachedReportings([
            ...attachedReportings,
            {
              ...result.data,
              missionId
            }
          ])
        )
        response.unsubscribe()
      } else {
        throw Error("Erreur à l'ajout du signalement")
      }
      response.unsubscribe()
    })
    .catch(error => {
      dispatch(setToast({ containerId: 'sideWindow', message: error }))
    })
}
