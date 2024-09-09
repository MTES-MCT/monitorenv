import { closeLayerOverlay } from '@features/layersSelector/metadataPanel/slice'
import { removeOverlayStroke } from 'domain/shared_slices/Global'
import { mapActions } from 'domain/shared_slices/Map'

import type { HomeAppThunk } from '@store/index'

export const closeAreaOverlay = (): HomeAppThunk => dispatch => {
  dispatch(closeLayerOverlay())
  dispatch(removeOverlayStroke())
  dispatch(mapActions.setIsAreaSelected(false))
}
