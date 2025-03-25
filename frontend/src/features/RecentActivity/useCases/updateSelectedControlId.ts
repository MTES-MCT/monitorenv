import { removeOverlayStroke } from 'domain/shared_slices/Global'

import { recentActivityActions } from '../slice'

import type { HomeAppThunk } from '@store/index'

export const updateSelectedControlId =
  (id?: string | undefined): HomeAppThunk =>
  async dispatch => {
    await dispatch(recentActivityActions.resetControlListOverlay())
    await dispatch(removeOverlayStroke())

    dispatch(recentActivityActions.setSelectedControlId(id))
  }
