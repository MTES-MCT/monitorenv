import { REPORTING_VALUES_TO_EXCLUDE_FOR_API } from '@features/Reportings/constants'
import { omit } from 'lodash'

import { reportingsAPI } from '../../../api/reportingsAPI'
import { setToast } from '../../shared_slices/Global'
import { reportingActions } from '../../shared_slices/reporting'

import type { ReportingData } from '../../entities/reporting'

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

    const valuesToUpdate = {
      ...omit(reportingToArchive, ...REPORTING_VALUES_TO_EXCLUDE_FOR_API),
      isArchived: true
    } as ReportingData

    const response = await dispatch(reportingsAPI.endpoints.updateReporting.initiate(valuesToUpdate))
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
