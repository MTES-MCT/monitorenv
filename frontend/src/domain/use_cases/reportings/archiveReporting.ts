import { reportingsAPI } from '../../../api/reportingsAPI'
import { setToast } from '../../shared_slices/Global'
import { multiReportingsActions } from '../../shared_slices/MultiReportings'

import type { Reporting } from '../../entities/reporting'

export const archiveReportingFromTable = (id: number) => async (dispatch, getState) => {
  const {
    multiReportings: { activeReportingId, selectedReportings }
  } = getState()
  try {
    const isReportingExistInLocalStore = selectedReportings[id] || undefined
    let reportingToArchive = isReportingExistInLocalStore ? selectedReportings[id].reporting : undefined
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
        dispatch(multiReportingsActions.setReporting({ ...selectedReportings[id].reporting, reporting: response.data }))
      }
    }
  } catch (error) {
    dispatch(setToast({ containerId: 'sideWindow', message: error }))
  }
}
