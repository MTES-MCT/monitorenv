import { reportingActions } from '@features/Reportings/slice'
import { setReportingFormVisibility, setToast, ReportingContext, VisibilityState } from 'domain/shared_slices/Global'
import {
  MapInteractionListenerEnum,
  updateMapInteractionListeners
} from 'domain/use_cases/map/updateMapInteractionListeners'
import omit from 'lodash/omit'

import { reportingsAPI } from '../../../api/reportingsAPI'
import { ApiErrorCode } from '../../../api/types'
import { mainWindowActions } from '../../MainWindow/slice'
import { isNewReporting } from '../utils'

import type { Reporting } from '../../../domain/entities/reporting'

export const saveReporting =
  (values: Reporting | Partial<Reporting>, reportingContext: ReportingContext, quitAfterSave = false) =>
  async dispatch => {
    const valuesToSave = omit(values, ['attachedMission'])
    const reportingIsNew = isNewReporting(values.id)
    const newOrNextReportingData = reportingIsNew ? { ...valuesToSave, id: undefined } : valuesToSave
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
