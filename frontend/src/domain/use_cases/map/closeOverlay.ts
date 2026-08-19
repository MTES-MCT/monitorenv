import { closeOpenedOverlay as closeOpenedOverlayAction, removeOverlayStroke } from 'domain/shared_slices/Global'

import type { HomeAppThunk } from '@store/index'

export const closeOverlay = (): HomeAppThunk => dispatch => {
  dispatch(closeOpenedOverlayAction())
  dispatch(removeOverlayStroke())
}
