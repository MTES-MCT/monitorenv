export const saveReportingInMultiReportingsState = () => async (_, getState) => {
  const {
    multiReportings: { selectedReportings },
    reportingState: { context, isFormDirty, reportingState }
  } = getState()
  const reportings = [...selectedReportings]
  const selectedReportingIndex = reportings.findIndex(reporting => reporting.reporting.id === reportingState.id)

  const formattedReporting = {
    context,
    isFormDirty,
    reporting: reportingState
  }

  if (selectedReportingIndex !== -1) {
    reportings[selectedReportingIndex] = formattedReporting
  } else {
    reportings.push(formattedReporting)
  }

  return reportings
}
