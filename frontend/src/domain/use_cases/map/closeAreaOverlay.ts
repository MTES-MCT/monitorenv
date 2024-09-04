import { closeLayerOverlay } from '@features/layersSelector/metadataPanel/slice'
import { Layers } from 'domain/entities/layers/constants'
import { removeOverlayCoordinatesByName } from 'domain/shared_slices/Global'
import { mapActions } from 'domain/shared_slices/Map'

import type { HomeAppThunk } from '@store/index'

export const closeAreaOverlay = (): HomeAppThunk => dispatch => {
  dispatch(closeLayerOverlay())
  dispatch(removeOverlayCoordinatesByName(Layers.LAYER_LIST_ICON.code))
  dispatch(mapActions.setIsAreaSelected(false))
}
