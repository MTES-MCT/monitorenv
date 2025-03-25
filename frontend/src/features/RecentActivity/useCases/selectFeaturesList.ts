import { removeOverlayStroke } from 'domain/shared_slices/Global'

import { recentActivityActions } from '../slice'

import type { RecentActivity } from '../types'
import type { HomeAppThunk } from '@store/index'
import type { OverlayItem } from 'domain/types/map'

type SelectFeaturesListType = {
  coordinates: number[]
  items?: OverlayItem<string, RecentActivity.RecentControlsActivity>[]
}

export const selectFeaturesList =
  ({ coordinates, items }: SelectFeaturesListType): HomeAppThunk =>
  async dispatch => {
    dispatch(removeOverlayStroke())
    await dispatch(recentActivityActions.resetControlListOverlay())
    dispatch(recentActivityActions.setLayerOverlayItems(items))
    dispatch(recentActivityActions.setLayerOverlayCoordinates(coordinates))
    dispatch(recentActivityActions.setIsControlsListClicked(true))
    dispatch(recentActivityActions.setSelectedControlId())
  }
