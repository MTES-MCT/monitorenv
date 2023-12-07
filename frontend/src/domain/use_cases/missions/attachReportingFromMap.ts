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

  try {
    const reportingRequest = dispatch(reportingsAPI.endpoints.getReporting.initiate(id))
    const reportingResponse = await reportingRequest.unwrap()
    if (!reportingResponse) {
      throw Error()
    }

    dispatch(
      attachReportingToMissionSliceActions.setAttachedReportings([
        ...attachedReportings,
        {
          ...reportingResponse.data,
          missionId
        }
      ])
    )

    reportingRequest.unsubscribe()
  } catch (error) {
    dispatch(setToast({ containerId: 'sideWindow', message: "Erreur à l'ajout du signalement" }))
  }
}
