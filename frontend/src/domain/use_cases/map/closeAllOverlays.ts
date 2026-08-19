import { closeAreaOverlay } from './closeAreaOverlay'
import { closeOverlay } from './closeOverlay'

import type { HomeAppDispatch, HomeAppThunk } from '@store/index'

export const closeAllOverlays = (): HomeAppThunk => async (dispatch: HomeAppDispatch) => {
  dispatch(closeOverlay())
  dispatch(closeAreaOverlay())
}
