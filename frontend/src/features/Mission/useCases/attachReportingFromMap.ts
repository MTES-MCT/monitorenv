import { reportingsAPI } from '@api/reportingsAPI'
import { attachReportingToMissionSliceActions } from '@features/Mission/components/MissionForm/AttachReporting/slice'
import { setToast } from 'domain/shared_slices/Global'

export const attachReportingFromMap = (reportingId: number) => async (dispatch, getState) => {
  const { attachedReportings } = getState().attachReportingToMission
  const { attachedReportingIds } = getState().attachReportingToMission
  const missionId = getState().missionForms.activeMissionId

  if (attachedReportingIds.includes(reportingId)) {
    return
  }

  try {
    const reportingRequest = dispatch(reportingsAPI.endpoints.getReporting.initiate(reportingId))
    const reportingResponse = await reportingRequest.unwrap()
    if (!reportingResponse) {
      throw Error()
    }

    await dispatch(
      attachReportingToMissionSliceActions.setAttachedReportings([
        ...attachedReportings,
        {
          ...reportingResponse,
          missionId
        }
      ])
    )

    await reportingRequest.unsubscribe()
  } catch (error) {
    dispatch(setToast({ containerId: 'sideWindow', message: "Erreur à l'ajout du signalement" }))
  }
}
