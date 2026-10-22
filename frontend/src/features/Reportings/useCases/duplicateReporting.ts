import { mainWindowActions } from '@features/MainWindow/slice'
import { attachMissionToReportingSliceActions } from '@features/Reportings/components/ReportingForm/AttachMission/slice'
import { reportingActions } from '@features/Reportings/slice'
import { addSideWindowBanner } from '@features/SideWindow/useCases/addSideWindowBanner'
import { Level } from '@mtes-mct/monitor-ui'
import { ReportingContext, setReportingFormVisibility, VisibilityState } from 'domain/shared_slices/Global'

import { reportingsAPI } from '../../../api/reportingsAPI'
import { createIdForNewReporting, getReportingInitialValues } from '../utils'

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
        reportingId: undefined,
        reportingSources: reportingResponse.reportingSources.map(reportingSource => ({
          ...reportingSource,
          id: undefined
        })),
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

    dispatch(mainWindowActions.setHasFullHeightRightDialogOpen(false))
    dispatch(
      setReportingFormVisibility({
        context: ReportingContext.SIDE_WINDOW,
        visibility: VisibilityState.VISIBLE
      })
    )
    await reportingRequest.unsubscribe()
  } catch (error) {
    dispatch(
      addSideWindowBanner({
        children: 'Erreur à la duplication du signalement',
        isClosable: true,
        isFixed: true,
        level: Level.ERROR,
        withAutomaticClosing: true
      })
    )
  }
}
