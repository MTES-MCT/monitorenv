import {
  setAreRecentsAreasChecked,
  setFilteredRegulatoryTags,
  setFilteredRegulatoryThemes,
  setGlobalSearchText,
  setIsAmpSearchResultsVisible,
  setIsRegulatorySearchResultsVisible,
  setIsVigilanceAreaSearchResultsVisible,
  setSearchExtent,
  setShouldFilterSearchOnMapExtent
} from '@features/layersSelector/search/slice'
import { vigilanceAreaFiltersActions } from '@features/VigilanceArea/components/VigilanceAreasList/Filters/slice'

import type { HomeAppThunk } from '@store/index'

export const resetVigilanceAreaListFilters = (): HomeAppThunk => async (dispatch, getState) => {
  const { searchExtent } = getState().layerSearch
  dispatch(vigilanceAreaFiltersActions.resetFilters())
  dispatch(setFilteredRegulatoryTags([]))
  dispatch(setFilteredRegulatoryThemes([]))
  dispatch(setIsVigilanceAreaSearchResultsVisible(false))
  dispatch(setGlobalSearchText(''))
  dispatch(setAreRecentsAreasChecked(false))

  if (searchExtent) {
    dispatch(setSearchExtent(undefined))
    dispatch(setIsAmpSearchResultsVisible(false))
    dispatch(setIsRegulatorySearchResultsVisible(false))
    dispatch(setShouldFilterSearchOnMapExtent(false))
  }
}
