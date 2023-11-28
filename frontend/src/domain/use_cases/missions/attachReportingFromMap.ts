import { reportingsAPI } from '../../../api/reportingsAPI'
import { attachReportingToMissionSliceActions } from '../../../features/missions/slice'
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
      if (!result.data) {
        throw Error("Erreur à l'ajout du signalement")
      }
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
    })
    .catch(error => {
      dispatch(setToast({ containerId: 'sideWindow', message: error }))
    })
}
