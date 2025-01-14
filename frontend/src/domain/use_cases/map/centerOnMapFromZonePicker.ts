import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '@mtes-mct/monitor-ui'
import { setFitToExtent } from 'domain/shared_slices/Map'
import { boundingExtent } from 'ol/extent'
import { transformExtent } from 'ol/proj'

import type { HomeAppDispatch, HomeAppThunk } from '@store/index'

export const centerOnMapFromZonePicker =
  (coordinates): HomeAppThunk =>
  async (dispatch: HomeAppDispatch) => {
    if (!coordinates || !coordinates.length) {
      return
    }
    const extent = transformExtent(boundingExtent(coordinates), WSG84_PROJECTION, OPENLAYERS_PROJECTION)
    dispatch(setFitToExtent(extent))
  }
