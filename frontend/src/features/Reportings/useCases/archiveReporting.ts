import { reportingActions } from '@features/Reportings/slice'

import { reportingsAPI } from '../../../api/reportingsAPI'
import {
  ReportingContext,
  setReportingFormVisibility,
  setToast,
  VisibilityState
} from '../../../domain/shared_slices/Global'

import type { HomeAppThunk } from '@store/index'

export const archiveReporting =
  (
    id: number,
    context: ReportingContext = ReportingContext.SIDE_WINDOW,
    closeReporting: boolean = false
  ): HomeAppThunk =>
  async (dispatch, getState) => {
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
          dispatch(
            setToast({
              containerId: context === ReportingContext.MAP ? 'map' : 'sideWindow',
              message: 'Le signalement a bien été archivé',
              type: 'success'
            })
          )

          dispatch(
            setReportingFormVisibility({
              context,
              visibility: VisibilityState.NONE
            })
          )

          return
        }

        dispatch(
          setToast({
            containerId: 'sideWindow',
            message: 'Le signalement a bien été archivé',
            type: 'success'
          })
        )
        if (isReportingExistInLocalStore) {
          const { data: reporting } = await dispatch(reportingsAPI.endpoints.getReporting.initiate(id))

          if (reporting && reportings[id]) {
            dispatch(reportingActions.setReporting({ ...reportings[id], reporting }))
          }
        }
      }
    } catch (error) {
      dispatch(setToast({ containerId: 'sideWindow', message: error }))
    }
  }
