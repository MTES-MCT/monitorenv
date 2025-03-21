import { globalActions } from 'domain/shared_slices/Global'

import type { HomeAppDispatch, HomeAppThunk } from '@store/index'

export const setOpenedOverlay =
  (featureId: string): HomeAppThunk =>
  async (dispatch: HomeAppDispatch) => {
    dispatch(globalActions.setOpenedOverlay(featureId))
  }
