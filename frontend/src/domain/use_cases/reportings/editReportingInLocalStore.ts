import { reportingsAPI } from '../../../api/reportingsAPI'
import { setReportingFormVisibility, setToast, ReportingContext, VisibilityState } from '../../shared_slices/Global'
import { multiReportingsActions } from '../../shared_slices/MultiReportings'

export const editReportingInLocalStore =
  (reportingId: number, reportingContext: ReportingContext) => async (dispatch, getState) => {
    const reportingToEdit = reportingsAPI.endpoints.getReporting
    try {
      const {
        multiReportings: { selectedReportings }
      } = getState()

      const reportings = { ...selectedReportings }
      let newReporting

      if (reportings[reportingId] !== undefined) {
        newReporting = {
          ...reportings[reportingId],
          context: reportingContext
        }
      } else {
        // if the reporting not already in multiReportings state
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

      await dispatch(multiReportingsActions.setReporting(newReporting))
      await dispatch(multiReportingsActions.setActiveReportingId(reportingId))

      await dispatch(
        setReportingFormVisibility({
          context: reportingContext,
          visibility: VisibilityState.VISIBLE
        })
      )
    } catch (error) {
      dispatch(setToast({ message: error }))
    }
  }
