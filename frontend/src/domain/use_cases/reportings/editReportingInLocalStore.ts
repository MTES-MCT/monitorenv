import { saveReportingInMultiReportingsState } from './saveReportingInMultiReportingsState'
import { reportingsAPI } from '../../../api/reportingsAPI'
import { setReportingFormVisibility, setToast } from '../../shared_slices/Global'
import { multiReportingsActions } from '../../shared_slices/MultiReportings'
import { ReportingContext, VisibilityState } from '../../shared_slices/ReportingState'

export const editReportingInLocalStore =
  (reportingId: number, reportingContext: ReportingContext) => async (dispatch, getState) => {
    const reportingToEdit = reportingsAPI.endpoints.getReporting
    try {
      const {
        multiReportings: { selectedReportings },
        reportingState: { reportingState }
      } = getState()

      let updatedReportings = [...selectedReportings]

      // first we want to save the active reporting in multiReportings state
      if (reportingState) {
        updatedReportings = await dispatch(saveReportingInMultiReportingsState())
      }

      const newSelectedReportingIndex = updatedReportings.findIndex(reporting => reporting.reporting.id === reportingId)

      // if the reporting is already in multiReportings state (newSelectedReportingIndex !== -1)
      // we want to update it with local values and update context with the new one
      if (newSelectedReportingIndex !== -1) {
        updatedReportings[newSelectedReportingIndex] = {
          ...updatedReportings[newSelectedReportingIndex],
          context: reportingContext
        }

        await dispatch(
          multiReportingsActions.setSelectedReportings({
            activeReportingId: reportingId,
            selectedReportings: updatedReportings
          })
        )
        dispatch(
          setReportingFormVisibility({
            context: reportingContext,
            visibility: VisibilityState.VISIBLE
          })
        )

        return
      }

      // if the reporting not already in multiReportings state
      const response = await dispatch(reportingToEdit.initiate(reportingId))
      if ('data' in response) {
        const reportingToSave = response.data

        await dispatch(
          multiReportingsActions.setSelectedReportings({
            activeReportingId: reportingToSave?.id,
            selectedReportings: [
              ...updatedReportings,
              {
                context: reportingContext,
                isFormDirty: false,
                reporting: reportingToSave
              }
            ]
          })
        )
        dispatch(
          setReportingFormVisibility({
            context: reportingContext,
            visibility: VisibilityState.VISIBLE
          })
        )
      } else {
        throw Error('Erreur à la récupération du signalement')
      }
    } catch (error) {
      dispatch(setToast({ message: error }))
    }
  }
