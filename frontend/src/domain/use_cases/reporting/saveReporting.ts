import { REPORTING_VALUES_TO_EXCLUDE_FOR_API } from '@features/Reportings/constants'
import omit from 'lodash/omit'

import { reportingsAPI } from '../../../api/reportingsAPI'
import { ApiErrorCode } from '../../../api/types'
import { mainWindowActions } from '../../../features/MainWindow/slice'
import { isNewReporting } from '../../../features/Reportings/utils'
import { setReportingFormVisibility, setToast, ReportingContext, VisibilityState } from '../../shared_slices/Global'
import { reportingActions } from '../../shared_slices/reporting'
import { MapInteractionListenerEnum, updateMapInteractionListeners } from '../map/updateMapInteractionListeners'

import type { Reporting, ReportingData } from '../../entities/reporting'

export const saveReporting =
  (values: Reporting, reportingContext: ReportingContext, quitAfterSave = false) =>
  async dispatch => {
    const valuesToSave = omit(values, ...REPORTING_VALUES_TO_EXCLUDE_FOR_API)

    const reportingIsNew = isNewReporting(values.id)
    const reportingId = reportingIsNew ? undefined : Number(values.id)
    const newOrNextReportingData = {
      ...valuesToSave,
      id: reportingId
    } as ReportingData

    const endpoint = isNewReporting(values.id)
      ? reportingsAPI.endpoints.createReporting
      : reportingsAPI.endpoints.updateReporting

    await dispatch(reportingActions.setIsListeningToEvents(false))
    try {
      const response = await dispatch(endpoint.initiate(newOrNextReportingData))
      if ('data' in response) {
        if (reportingIsNew) {
          const newReporting = {
            context: reportingContext,
            isFormDirty: false,
            reporting: response.data
          }

          dispatch(
            reportingActions.setCreatedReporting({ createdReporting: newReporting, previousId: String(values.id) })
          )
          dispatch(updateMapInteractionListeners(MapInteractionListenerEnum.NONE))
        } else {
          dispatch(
            reportingActions.setReporting({
              context: reportingContext,
              isFormDirty: false,
              reporting: response.data
            })
          )
        }

        setTimeout(async () => {
          await dispatch(reportingActions.setIsListeningToEvents(true))
        }, 500)

        if (!quitAfterSave) {
          return
        }

        if (reportingContext === ReportingContext.MAP) {
          dispatch(mainWindowActions.setHasFullHeightRightDialogOpen(false))
        }
        dispatch(
          setReportingFormVisibility({
            context: reportingContext,
            visibility: VisibilityState.NONE
          })
        )
        dispatch(updateMapInteractionListeners(MapInteractionListenerEnum.NONE))
        dispatch(reportingActions.deleteSelectedReporting(values.id))
      } else {
        if (response.error.data?.type === ApiErrorCode.CHILD_ALREADY_ATTACHED) {
          throw Error('Le signalement est déjà rattaché à une mission')
        }
        throw Error('Erreur à la création ou à la modification du signalement')
      }
    } catch (error) {
      dispatch(setToast({ containerId: reportingContext, message: error }))
    }
  }
