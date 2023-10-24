import { ReportingContext, VisibilityState, type GlobalState } from '../../domain/shared_slices/Global'

export function getVisibilityState(global: GlobalState): VisibilityState {
  if (
    global.reportingFormVisibility.context === ReportingContext.MAP &&
    global.reportingFormVisibility.visibility !== VisibilityState.NONE
  ) {
    return global.reportingFormVisibility.visibility
  }

  if (global.isControlUnitDialogVisible) {
    return VisibilityState.VISIBLE
  }

  return VisibilityState.NONE
}
