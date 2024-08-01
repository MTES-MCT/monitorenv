import { type PayloadAction, createSlice } from '@reduxjs/toolkit'

type LayerSearchState = {
  ampsSearchResult: number[] | undefined
  filteredAmpTypes: string[]
  filteredRegulatoryThemes: string[]
  filteredVigilanceAreaPeriod: string | undefined
  globalSearchText: string
  isAmpSearchResultsVisible: boolean
  isRegulatorySearchResultsVisible: boolean
  isVigilanceAreaSearchResultsVisible: boolean
  regulatoryLayersSearchResult: number[] | undefined
  searchExtent: number[] | undefined
  shouldFilterSearchOnMapExtent: boolean
  vigilanceAreaSearchResult: number[] | undefined
  vigilanceAreaSpecificPeriodFilter: string[] | undefined
}
const initialState: LayerSearchState = {
  ampsSearchResult: undefined,
  filteredAmpTypes: [],
  filteredRegulatoryThemes: [],
  filteredVigilanceAreaPeriod: undefined,
  globalSearchText: '',
  isAmpSearchResultsVisible: true,
  isRegulatorySearchResultsVisible: true,
  isVigilanceAreaSearchResultsVisible: true,
  regulatoryLayersSearchResult: undefined,
  searchExtent: undefined,
  shouldFilterSearchOnMapExtent: false,
  vigilanceAreaSearchResult: undefined,
  vigilanceAreaSpecificPeriodFilter: undefined
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

    setFilteredVigilanceAreaPeriod(state, action: PayloadAction<string | undefined>) {
      state.filteredVigilanceAreaPeriod = action.payload
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
    setIsVigilanceAreaSearchResultsVisible(state, action: PayloadAction<boolean>) {
      state.isVigilanceAreaSearchResultsVisible = action.payload
    },

    setRegulatoryLayersSearchResult(state, action) {
      state.regulatoryLayersSearchResult = action.payload
    },

    setSearchExtent(state, action) {
      state.searchExtent = action.payload
    },

    setShouldFilterSearchOnMapExtent(state, action: PayloadAction<boolean>) {
      state.shouldFilterSearchOnMapExtent = action.payload
    },

    setVigilanceAreaSpecificPeriodFilter(state, action: PayloadAction<Array<string> | undefined>) {
      state.vigilanceAreaSpecificPeriodFilter = action.payload
    },

    setVigilanceAreasSearchResult(state, action: PayloadAction<Array<number>>) {
      state.vigilanceAreaSearchResult = action.payload
    }
  }
})

export const {
  resetSearchExtent,
  setAMPsSearchResult,
  setFilteredAmpTypes,
  setFilteredRegulatoryThemes,
  setFilteredVigilanceAreaPeriod,
  setGlobalSearchText,
  setIsAmpSearchResultsVisible,
  setIsRegulatorySearchResultsVisible,
  setIsVigilanceAreaSearchResultsVisible,
  setRegulatoryLayersSearchResult,
  setSearchExtent,
  setShouldFilterSearchOnMapExtent,
  setVigilanceAreaSpecificPeriodFilter,
  setVigilanceAreasSearchResult
} = layerSearchSlice.actions

export const layerSearchSliceReducer = layerSearchSlice.reducer
