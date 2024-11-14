import { attachMissionToReportingSliceActions } from '@features/Reportings/components/ReportingForm/AttachMission/slice'
import { reportingActions } from '@features/Reportings/slice'

import { reportingsAPI } from '../../../api/reportingsAPI'
import { getReportingInitialValues, createIdForNewReporting } from '../../../features/Reportings/utils'
import { setReportingFormVisibility, setToast, ReportingContext, VisibilityState } from '../../shared_slices/Global'

export const duplicateReporting = (reportingId: number) => async (dispatch, getState) => {
  const { reportings } = getState().reporting

  const reportingToDuplicate = reportingsAPI.endpoints.getReporting

  try {
    const reportingRequest = dispatch(reportingToDuplicate.initiate(reportingId))
    const reportingResponse = await reportingRequest.unwrap()

    if (!reportingResponse) {
      throw Error()
    }

    const id = createIdForNewReporting(reportings)

    const duplicatedReporting = {
      context: ReportingContext.SIDE_WINDOW,
      isFormDirty: false,
      reporting: getReportingInitialValues({
        ...reportingResponse,
        createdAt: new Date().toISOString(),
        id,
        isArchived: false,
        openBy: undefined,
        updatedAtUtc: undefined
      })
    }

    await dispatch(reportingActions.setReporting(duplicatedReporting))
    await dispatch(reportingActions.setActiveReportingId(id))

    await dispatch(
      attachMissionToReportingSliceActions.setAttachedMission(
        duplicatedReporting.reporting.attachedMission ?? undefined
      )
    )

    dispatch(
      setReportingFormVisibility({
        context: ReportingContext.SIDE_WINDOW,
        visibility: VisibilityState.VISIBLE
      })
    )
    await reportingRequest.unsubscribe()
  } catch (error) {
    dispatch(setToast({ containerId: 'sideWindow', message: 'Erreur à la duplication du signalement' }))
  }
}
