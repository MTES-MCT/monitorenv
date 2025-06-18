import { attachMissionToReportingSliceActions } from '@features/Reportings/components/ReportingForm/AttachMission/slice'
import { reportingActions } from '@features/Reportings/slice'
import { addSideWindowBanner } from '@features/SideWindow/useCases/addSideWindowBanner'
import { Level } from '@mtes-mct/monitor-ui'
import { ReportingContext, setReportingFormVisibility, VisibilityState } from 'domain/shared_slices/Global'

import { reportingsAPI } from '../../../api/reportingsAPI'
import { mainWindowActions } from '../../MainWindow/slice'

export const deleteReportings = (ids: number[], resetSelectionFn: () => void) => async (dispatch, getState) => {
  const { activeReportingId, context, selectedReportingIdOnMap } = getState().reporting

  try {
    const response = await dispatch(reportingsAPI.endpoints.deleteReportings.initiate({ ids }))
    if ('error' in response) {
      throw Error('Erreur à la suppression des signalements')
    } else {
      if (ids.includes(selectedReportingIdOnMap)) {
        dispatch(reportingActions.setSelectedReportingIdOnMap(undefined))
      }

      if (ids.includes(activeReportingId)) {
        await dispatch(reportingActions.setActiveReportingId(undefined))

        await dispatch(attachMissionToReportingSliceActions.resetAttachMissionState())
        if (context === ReportingContext.MAP) {
          dispatch(mainWindowActions.setHasFullHeightRightDialogOpen(false))
        }
        dispatch(
          setReportingFormVisibility({
            context,
            visibility: VisibilityState.NONE
          })
        )
      }

      ids.forEach(id => dispatch(reportingActions.deleteSelectedReporting(id)))

      dispatch(
        addSideWindowBanner({
          children: 'Les signalements ont bien été supprimés',
          isClosable: true,
          isFixed: true,
          level: Level.SUCCESS,
          withAutomaticClosing: true
        })
      )

      resetSelectionFn()
    }
  } catch (error) {
    dispatch(
      addSideWindowBanner({
        children: error instanceof Error ? error.message : String(error),
        isClosable: true,
        isFixed: true,
        level: Level.ERROR,
        withAutomaticClosing: true
      })
    )
  }
}
