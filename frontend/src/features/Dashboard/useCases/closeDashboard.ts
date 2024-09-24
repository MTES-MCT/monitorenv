import { globalActions } from 'domain/shared_slices/Global'

import { resetDrawing } from './resetDrawing'
import { dashboardActions } from '../slice'

import type { HomeAppThunk } from '@store/index'

export const closeDashboard = (): HomeAppThunk => dispatch => {
  dispatch(resetDrawing())
  closeMenuDialog()

  function closeMenuDialog() {
    dispatch(dashboardActions.setIsDrawing(false))
    dispatch(globalActions.setDisplayedItems({ isDashboardDialogVisible: false }))
  }
}
