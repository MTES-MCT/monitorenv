import { mainWindowActions } from '@features/MainWindow/slice'
import { reportingActions } from '@features/Reportings/slice'
import { Level } from '@mtes-mct/monitor-ui'

import { reportingsAPI } from '../../../api/reportingsAPI'
import { ReportingContext, setReportingFormVisibility, VisibilityState } from '../../../domain/shared_slices/Global'
import { displayReportingBanner } from '../utils'

import type { HomeAppDispatch, HomeAppThunk } from '@store/index'

export const archiveReporting =
  (
    id: number,
    context: ReportingContext = ReportingContext.SIDE_WINDOW,
    closeReporting: boolean = false
  ): HomeAppThunk =>
  async (dispatch: HomeAppDispatch, getState) => {
    const {
      reporting: { reportings }
    } = getState()
    try {
      const isReportingExistInLocalStore = reportings[id]
      const archiveResponse = await dispatch(reportingsAPI.endpoints.archiveReportings.initiate({ ids: [id] }))

      if ('error' in archiveResponse) {
        throw Error("Erreur à l'archivage du signalement")
      } else {
        if (closeReporting) {
          dispatch(reportingActions.deleteSelectedReporting(id))
          displayReportingBanner({
            context,
            dispatch,
            level: Level.SUCCESS,
            message: 'Le signalement a bien été archivé'
          })

          if (context === ReportingContext.MAP) {
            dispatch(mainWindowActions.setHasFullHeightRightDialogOpen(false))
          }

          dispatch(
            setReportingFormVisibility({
              context,
              visibility: VisibilityState.NONE
            })
          )

          return
        }
        displayReportingBanner({
          context: ReportingContext.SIDE_WINDOW,
          dispatch,
          level: Level.SUCCESS,
          message: 'Le signalement a bien été archivé'
        })

        if (isReportingExistInLocalStore) {
          const { data: reporting } = await dispatch(reportingsAPI.endpoints.getReporting.initiate(id))

          if (reporting && reportings[id]) {
            dispatch(reportingActions.setReporting({ ...reportings[id], reporting }))
          }
        }
      }
    } catch (error) {
      displayReportingBanner({
        context,
        dispatch,
        level: Level.ERROR,
        message: error instanceof Error ? error.message : String(error)
      })
    }
  }
