import { mainWindowActions } from '@features/MainWindow/slice'
import { reportingActions } from '@features/Reportings/slice'
import { Level } from '@mtes-mct/monitor-ui'
import omit from 'lodash/omit'

import { reportingsAPI } from '../../../api/reportingsAPI'
import { ReportingContext, setReportingFormVisibility, VisibilityState } from '../../../domain/shared_slices/Global'
import {
  MapInteractionListenerEnum,
  updateMapInteractionListeners
} from '../../../domain/use_cases/map/updateMapInteractionListeners'
import { addMission } from '../../Mission/useCases/addMission'
import { displayReportingBanner, isNewReporting } from '../utils'

import type { Reporting } from '../../../domain/entities/reporting'

export const createMissionFromReporting = (values: Reporting | Partial<Reporting>) => async (dispatch, getState) => {
  const {
    reportingFormVisibility: { context: reportingContext }
  } = getState().global.visibility

  const valuesToSave = omit(values, ['attachedMission'])
  const newOrNextReportingData = isNewReporting(valuesToSave.id) ? { ...valuesToSave, id: undefined } : valuesToSave
  const endpoint = reportingsAPI.endpoints.createReporting
  await dispatch(reportingActions.setIsListeningToEvents(false))

  try {
    const response = await dispatch(endpoint.initiate(newOrNextReportingData))

    if ('data' in response) {
      if (reportingContext === ReportingContext.MAP) {
        dispatch(mainWindowActions.setHasFullHeightRightDialogOpen(false))
      }
      dispatch(
        setReportingFormVisibility({
          context: reportingContext,
          visibility: VisibilityState.NONE
        })
      )
      await dispatch(updateMapInteractionListeners(MapInteractionListenerEnum.NONE))
      await dispatch(reportingActions.deleteSelectedReporting(values.id))
      await dispatch(addMission({ attachedReporting: response.data }))
      setTimeout(async () => {
        await dispatch(reportingActions.setIsListeningToEvents(true))
      }, 500)
    } else {
      throw Error('Erreur à la création de la mission depuis le signalement')
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
