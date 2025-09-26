import { reportingActions } from '@features/Reportings/slice'
import { Level } from '@mtes-mct/monitor-ui'
import { setReportingFormVisibility, ReportingContext, VisibilityState } from 'domain/shared_slices/Global'
import {
  MapInteractionListenerEnum,
  updateMapInteractionListeners
} from 'domain/use_cases/map/updateMapInteractionListeners'
import { omit } from 'lodash-es'

import { reportingsAPI } from '../../../api/reportingsAPI'
import { ApiErrorCode } from '../../../api/types'
import { mainWindowActions } from '../../MainWindow/slice'
import { displayReportingBanner, isNewReporting } from '../utils'

import type { Reporting } from '../../../domain/entities/reporting'
import type { HomeAppThunk } from '@store/index'

export const saveReporting =
  (values: Reporting | Partial<Reporting>, reportingContext: ReportingContext, quitAfterSave = false): HomeAppThunk =>
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
      if (response.data) {
        if (reportingIsNew) {
          const newReporting = {
            context: reportingContext,
            isFormDirty: false,
            reporting: { ...response.data, id: response.data.id! }
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
              reporting: { ...response.data, id: response.data.id! }
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
      } else if ('data' in response.error) {
        if (response.error.data?.code === ApiErrorCode.CHILD_ALREADY_ATTACHED) {
          throw Error('Le signalement est déjà rattaché à une mission')
        }
        if (response.error.data?.code === ApiErrorCode.UNVALID_PROPERTY) {
          throw Error('Une propriété est invalide')
        }
        throw Error('Erreur à la création ou à la modification du signalement')
      }
    } catch (error) {
      displayReportingBanner({
        context: reportingContext,
        dispatch,
        level: Level.ERROR,
        message: error instanceof Error ? error.message : String(error)
      })
    }
  }
