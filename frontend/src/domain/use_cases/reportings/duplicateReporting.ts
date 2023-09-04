import { reportingsAPI } from '../../../api/reportingsAPI'
import { getReportingInitialValues, createIdForNewReporting } from '../../../features/Reportings/utils'
import { setReportingFormVisibility, setToast } from '../../shared_slices/Global'
import { multiReportingsActions } from '../../shared_slices/MultiReportings'
import { ReportingContext, VisibilityState } from '../../shared_slices/ReportingState'

export const duplicateReporting = (reportingId: number) => async (dispatch, getState) => {
  const {
    multiReportings: { selectedReportings }
  } = getState()
  const reportings = [...selectedReportings]

  const reportingToDuplicate = reportingsAPI.endpoints.getReporting
  try {
    const response = await dispatch(reportingToDuplicate.initiate(reportingId))
    if ('data' in response) {
      const id = createIdForNewReporting(reportings)

      const updatedReportings = [
        ...reportings,
        {
          context: ReportingContext.SIDE_WINDOW,
          isFormDirty: false,
          reporting: getReportingInitialValues({ ...response.data, createdAt: new Date().toISOString(), id })
        }
      ]

      await dispatch(
        multiReportingsActions.setSelectedReportings({ activeReportingId: id, selectedReportings: updatedReportings })
      )

      await dispatch(
        setReportingFormVisibility({
          context: ReportingContext.SIDE_WINDOW,
          visibility: VisibilityState.VISIBLE
        })
      )
    } else {
      throw Error('Erreur à la récupération du signalement')
    }
  } catch (error) {
    dispatch(setToast({ containerId: 'sideWindow', message: error }))
  }

  dispatch(
    setReportingFormVisibility({
      context: ReportingContext.SIDE_WINDOW,
      visibility: VisibilityState.VISIBLE
    })
  )
}
