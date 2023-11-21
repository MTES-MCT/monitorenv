import { reportingsAPI } from '../../../api/reportingsAPI'
import { attachMissionToReportingSliceActions } from '../../../features/Reportings/slice'
import { getReportingInitialValues, createIdForNewReporting } from '../../../features/Reportings/utils'
import { setReportingFormVisibility, setToast, ReportingContext, VisibilityState } from '../../shared_slices/Global'
import { reportingActions } from '../../shared_slices/reporting'

export const duplicateReporting = (reportingId: number) => async (dispatch, getState) => {
  const { reportings } = getState().reporting

  const reportingToDuplicate = reportingsAPI.endpoints.getReporting

  const response = dispatch(reportingToDuplicate.initiate(reportingId))
  response
    .then(async result => {
      if (result.data) {
        const id = createIdForNewReporting(reportings)

        const duplicatedReporting = {
          context: ReportingContext.SIDE_WINDOW,
          isFormDirty: false,
          reporting: getReportingInitialValues({ ...result.data, createdAt: new Date().toISOString(), id })
        }

        await dispatch(reportingActions.setReporting(duplicatedReporting))
        await dispatch(reportingActions.setActiveReportingId(id))

        await dispatch(
          attachMissionToReportingSliceActions.setAttachedMission(
            duplicatedReporting.reporting.attachedMission ?? undefined
          )
        )
        await dispatch(
          attachMissionToReportingSliceActions.setMissionId(duplicatedReporting.reporting.missionId ?? undefined)
        )

        await dispatch(
          setReportingFormVisibility({
            context: ReportingContext.SIDE_WINDOW,
            visibility: VisibilityState.VISIBLE
          })
        )
        response.unsubscribe()
      } else {
        throw Error('Erreur à la duplication du signalement')
      }
    })
    .catch(error => {
      dispatch(setToast({ containerId: 'sideWindow', message: error }))
    })
}
