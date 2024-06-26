import { type PayloadAction, createSlice } from '@reduxjs/toolkit'

type LayerSearchState = {
  ampsSearchResult: number[] | undefined
  filteredAmpTypes: string[]
  filteredRegulatoryThemes: string[]
  globalSearchText: string
  isAmpSearchResultsVisible: boolean
  isRegulatorySearchResultsVisible: boolean
  regulatoryLayersSearchResult: number[] | undefined
  searchExtent: number[] | undefined
  shouldFilterSearchOnMapExtent: boolean
}
const initialState: LayerSearchState = {
  ampsSearchResult: undefined,
  filteredAmpTypes: [],
  filteredRegulatoryThemes: [],
  globalSearchText: '',
  isAmpSearchResultsVisible: true,
  isRegulatorySearchResultsVisible: true,
  regulatoryLayersSearchResult: undefined,
  searchExtent: undefined,
  shouldFilterSearchOnMapExtent: false
}

const layerSearchSlice = createSlice({
  initialState,
  name: 'layerSearch',
  reducers: {
    /**
     * Set the selected zone to filter regulations
     * @param {Object=} state
     */
    resetSearchExtent(state) {
      state.searchExtent = undefined
    },

    setAMPsSearchResult(state, action) {
      state.ampsSearchResult = action.payload
    },

    setFilteredAmpTypes(state, action: PayloadAction<string[]>) {
      state.filteredAmpTypes = action.payload
    },

    setFilteredRegulatoryThemes(state, action: PayloadAction<string[]>) {
      state.filteredRegulatoryThemes = action.payload
    },
    setGlobalSearchText(state, action: PayloadAction<string>) {
      state.globalSearchText = action.payload
    },

    setIsAmpSearchResultsVisible(state, action: PayloadAction<boolean>) {
      state.isAmpSearchResultsVisible = action.payload
    },

    setIsRegulatorySearchResultsVisible(state, action: PayloadAction<boolean>) {
      state.isRegulatorySearchResultsVisible = action.payload
    },
    setRegulatoryLayersSearchResult(state, action) {
      state.regulatoryLayersSearchResult = action.payload
    },
    setSearchExtent(state, action) {
      state.searchExtent = action.payload
    },
    setShouldFilterSearchOnMapExtent(state, action: PayloadAction<boolean>) {
      state.shouldFilterSearchOnMapExtent = action.payload
    }
  }
})

export const {
  resetSearchExtent,
  setAMPsSearchResult,
  setFilteredAmpTypes,
  setFilteredRegulatoryThemes,
  setGlobalSearchText,
  setIsAmpSearchResultsVisible,
  setIsRegulatorySearchResultsVisible,
  setRegulatoryLayersSearchResult,
  setSearchExtent,
  setShouldFilterSearchOnMapExtent
} = layerSearchSlice.actions

export const layerSearchSliceReducer = layerSearchSlice.reducer
