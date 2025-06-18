import { reportingsAPI } from '@api/reportingsAPI'
import { attachReportingToMissionSliceActions } from '@features/Mission/components/MissionForm/AttachReporting/slice'
import { addSideWindowBanner } from '@features/SideWindow/useCases/addSideWindowBanner'
import { Level } from '@mtes-mct/monitor-ui'

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
    dispatch(
      addSideWindowBanner({
        children: "Erreur à l'ajout du signalement",
        isClosable: true,
        isFixed: true,
        level: Level.ERROR,
        withAutomaticClosing: true
      })
    )
  }
}
