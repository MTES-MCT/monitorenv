import _ from 'lodash'

import { SideWindowReportingFormVisibility } from '../../../features/Reportings/sideWindowContext/context'
import { getReportingInitialValues, isNewReporting } from '../../../features/Reportings/utils'
import { setReportingFormVisibility } from '../../shared_slices/Global'
import { multiReportingsActions } from '../../shared_slices/MultiReportings'
import { ReportingContext, ReportingFormVisibility } from '../../shared_slices/ReportingState'

import type { Reporting } from '../../entities/reporting'

export const addReporting =
  (
    reportingContext: ReportingContext,
    partialReporting?: Partial<Reporting> | undefined,
    setContextVisibility?: (nextVisibility: SideWindowReportingFormVisibility) => void
  ) =>
  async (dispatch, getState) => {
    const {
      multiReportings: { selectedReportings },
      reportingState: { context, isFormDirty, reportingState }
    } = getState()
    const reportings = [...selectedReportings]

    // first we want to save the active reporting in multiReportings state
    if (reportingState) {
      const selectedReportingId = reportings.findIndex(reporting => reporting.reporting.id === reportingState.id)
      const reportingFormatted = {
        context,
        isFormDirty,
        reporting: reportingState
      }

      if (selectedReportingId !== -1) {
        reportings[selectedReportingId] = reportingFormatted
      } else {
        reportings.push(reportingFormatted)
      }
    }
    const maxNewReportingId = _.chain(reportings)
      .filter(newReporting => isNewReporting(newReporting.reporting.id))
      .maxBy(filteredNewReporting => Number(filteredNewReporting?.reporting?.id?.split('new-')[1]))
      .value()

    const id =
      maxNewReportingId && maxNewReportingId.reporting.id
        ? `new-${Number(maxNewReportingId?.reporting?.id?.split('new-')[1]) + 1}`
        : 'new-1'

    const updatedReportings = [
      ...reportings,
      {
        context: reportingContext,
        isFormDirty: false,
        reporting: getReportingInitialValues({ ...partialReporting, id })
      }
    ]

    await dispatch(
      multiReportingsActions.setSelectedReportings({ activeReportingId: id, selectedReportings: updatedReportings })
    )

    if (setContextVisibility) {
      setContextVisibility(SideWindowReportingFormVisibility.VISIBLE)
    } else {
      await dispatch(setReportingFormVisibility(ReportingFormVisibility.VISIBLE))
    }
  }
