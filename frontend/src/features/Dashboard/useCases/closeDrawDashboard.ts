import { globalActions } from 'domain/shared_slices/Global'

import { dashboardActions } from '../slice'

import type { HomeAppThunk } from '@store/index'

export const closeDrawDashboard = (): HomeAppThunk => dispatch => {
  closeMenuDialog()

  function closeMenuDialog() {
    dispatch(dashboardActions.setIsDrawing(false))
    dispatch(globalActions.setDisplayedItems({ visibility: { isDashboardDialogVisible: false } }))
  }
}
