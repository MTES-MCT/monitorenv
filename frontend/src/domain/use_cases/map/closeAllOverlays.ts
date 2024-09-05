import { closeOpenedOverlay } from 'domain/shared_slices/Global'

import { closeAreaOverlay } from './closeAreaOverlay'

import type { HomeAppDispatch, HomeAppThunk } from '@store/index'

export const closeAllOverlays = (): HomeAppThunk => async (dispatch: HomeAppDispatch) => {
  dispatch(closeOpenedOverlay())
  dispatch(closeAreaOverlay())
}
