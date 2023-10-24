import { reportingsAPI } from '../../../api/reportingsAPI'
import { attachMissionToReportingSliceActions } from '../../../features/Reportings/ReportingForm/AttachMission/slice'
import { setReportingFormVisibility, setToast, ReportingContext, VisibilityState } from '../../shared_slices/Global'
import { reportingActions } from '../../shared_slices/reporting'

export const editReportingInLocalStore =
  (reportingId: number, reportingContext: ReportingContext) => async (dispatch, getState) => {
    dispatch(attachMissionToReportingSliceActions.resetAttachMissionState())
    const reportingToEdit = reportingsAPI.endpoints.getReporting
    try {
      const { reportings } = getState().reporting

      let newReporting

      if (reportings[reportingId]) {
        newReporting = {
          ...reportings[reportingId],
          context: reportingContext
        }
      } else {
        // if the reporting not already in reporting state
        const response = await dispatch(reportingToEdit.initiate(reportingId))
        if ('data' in response) {
          const reportingToSave = response.data

          newReporting = {
            context: reportingContext,
            isFormDirty: false,
            reporting: reportingToSave
          }
        } else {
          throw Error('Erreur à la récupération du signalement')
        }
      }

      await dispatch(
        setReportingFormVisibility({
          context: reportingContext,
          visibility: VisibilityState.VISIBLE
        })
      )

      await dispatch(reportingActions.setReporting(newReporting))
      await dispatch(reportingActions.setActiveReportingId(reportingId))
      // if (newReporting.reporting.attachedMission) {
      await dispatch(
        attachMissionToReportingSliceActions.setAttachedMission(newReporting.reporting.attachedMission || undefined)
      )
      await dispatch(attachMissionToReportingSliceActions.setMissionId(newReporting.reporting.missionId || undefined))
      // }
    } catch (error) {
      dispatch(setToast({ message: error }))
    }
  }
