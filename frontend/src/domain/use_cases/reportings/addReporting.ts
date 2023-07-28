import { getReportingInitialValues } from '../../../features/Reportings/utils'
import { multiReportingsActions } from '../../shared_slices/MultiReportings'

import type { Reporting } from '../../entities/reporting'

export const addReporting = (partialReporting?: Partial<Reporting> | undefined) => async dispatch => {
  const newReporting = [{ isFormDirty: false, reporting: getReportingInitialValues(partialReporting) }]

  await dispatch(multiReportingsActions.setSelectedReportings(newReporting))
  await dispatch(multiReportingsActions.setNextSelectedReporting(undefined))
}
