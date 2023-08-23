import { addReporting } from './addReporting'
import { reportingsAPI } from '../../../api/reportingsAPI'
import { hideSideButtons, setReportingFormVisibility, setToast } from '../../shared_slices/Global'
import { multiReportingsActions } from '../../shared_slices/MultiReportings'
import { ReportingFormVisibility, reportingStateActions } from '../../shared_slices/ReportingState'

export const duplicateReporting = reportingId => async (dispatch, getState) => {
  const { isDirty } = getState().reportingState
  const reportingToDuplicate = reportingsAPI.endpoints.getReporting
  try {
    const response = await dispatch(reportingToDuplicate.initiate(reportingId))
    if ('data' in response) {
      const duplicatedReporting = {
        ...response.data,
        createdAt: new Date().toISOString(),
        id: undefined,
        reportingId: undefined
      }
      if (isDirty) {
        dispatch(reportingStateActions.setIsConfirmCancelDialogVisible(true))
        dispatch(multiReportingsActions.setNextSelectedReporting(duplicatedReporting))
      } else {
        dispatch(addReporting(duplicatedReporting))
        dispatch(
          setToast({
            containerId: 'sideWindow',
            message: 'Le signalement a bien été dupliqué',
            type: 'success'
          })
        )
      }
    } else {
      throw Error('Erreur à la récupération du signalement')
    }
  } catch (error) {
    dispatch(setToast({ containerId: 'sideWindow', message: error }))
  }

  dispatch(hideSideButtons())
  dispatch(setReportingFormVisibility(ReportingFormVisibility.VISIBLE))
}
