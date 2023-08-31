import { reportingsAPI } from '../../../api/reportingsAPI'
import { setReportingFormVisibility, setToast } from '../../shared_slices/Global'
import { multiReportingsActions } from '../../shared_slices/MultiReportings'
import { ReportingFormVisibility } from '../../shared_slices/ReportingState'

export const editReportingInLocalStore = (reportingId, reportingContext) => async (dispatch, getState) => {
  const reportingToEdit = reportingsAPI.endpoints.getReporting
  try {
    const {
      multiReportings: { selectedReportings },
      reportingState: { context, isFormDirty, reportingState }
    } = getState()

    const response = await dispatch(reportingToEdit.initiate(reportingId))

    if ('data' in response) {
      const reportings = [...selectedReportings]
      // first we want to save the active reporting in multiReportings state
      if (reportingState) {
        const selectedReportingIndex = reportings.findIndex(reporting => reporting.reporting.id === reportingState.id)

        const formattedReporting = {
          context,
          isFormDirty,
          reporting: reportingState
        }

        if (selectedReportingIndex !== -1) {
          reportings[selectedReportingIndex] = formattedReporting
        } else {
          reportings.push(formattedReporting)
        }
      }

      // now we want to save in multiReportings state the reporting we want to edit
      const reportingToSave = response.data
      const newSelectedReportingIndex = reportings.findIndex(
        reporting => reporting.reporting.id === reportingToSave?.id
      )
      const formattedReporting = {
        context: reportingContext,
        isFormDirty: false,
        reporting: reportingToSave
      }
      if (newSelectedReportingIndex === -1) {
        reportings.push(formattedReporting)
      }

      await dispatch(
        multiReportingsActions.setSelectedReportings({
          activeReportingId: reportingToSave?.id,
          selectedReportings: reportings
        })
      )
      await dispatch(setReportingFormVisibility(ReportingFormVisibility.VISIBLE))
    } else {
      throw Error('Erreur à la récupération du signalement')
    }
  } catch (error) {
    dispatch(setToast({ message: error }))
  }
}
