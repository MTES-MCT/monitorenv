import { reportingActions } from '@features/Reportings/slice'

import { reportingsAPI } from '../../../api/reportingsAPI'
import { setToast } from '../../../domain/shared_slices/Global'

import type { Reporting } from '../../../domain/entities/reporting'

export const archiveReportingFromTable = (id: number) => async (dispatch, getState) => {
  const {
    reporting: { activeReportingId, reportings }
  } = getState()
  try {
    const isReportingExistInLocalStore = reportings[id] || undefined
    let reportingToArchive = isReportingExistInLocalStore ? reportings[id].reporting : undefined

    if (id !== activeReportingId || !reportingToArchive) {
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
      if (isReportingExistInLocalStore) {
        dispatch(reportingActions.setReporting({ ...reportings[id].reporting, reporting: response.data }))
      }
    }
  } catch (error) {
    dispatch(setToast({ containerId: 'sideWindow', message: error }))
  }
}
