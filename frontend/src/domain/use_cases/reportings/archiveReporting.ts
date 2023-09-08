import { reportingsAPI } from '../../../api/reportingsAPI'
import { setToast } from '../../shared_slices/Global'

import type { AppGetState } from '../../../store'
import type { Reporting } from '../../entities/reporting'

export const archiveReportingFromTable = (id: number) => async (dispatch, getState: AppGetState) => {
  const {
    multiReportings: { selectedReportings }
  } = getState()
  const reportingState = selectedReportings.find(reporting => reporting.reporting.id === id)?.reporting
  try {
    let reportingToArchive = reportingState || {}
    if (!reportingState) {
      const { data: reporting } = await dispatch(reportingsAPI.endpoints.getReporting.initiate(id))
      reportingToArchive = reporting
    }

    const response = await dispatch(
      reportingsAPI.endpoints.updateReporting.initiate({ ...(reportingToArchive as Reporting), isArchived: true })
    )
    if ('error' in response) {
      throw Error("Erreur à l'archivage du signalement")
    } else {
      dispatch(
        setToast({
          containerId: 'sideWindow',
          message: 'Le signalement a bien été archivé',
          type: 'success'
        })
      )
    }
  } catch (error) {
    dispatch(setToast({ containerId: 'sideWindow', message: error }))
  }
}
