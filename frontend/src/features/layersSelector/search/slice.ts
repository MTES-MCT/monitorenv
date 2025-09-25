import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type { TagOption } from 'domain/entities/tags'
import type { ThemeOption } from 'domain/entities/themes'

type LayerSearchState = {
  ampsSearchResult: number[] | undefined
  filteredAmpTypes: string[]
  filteredRegulatoryTags: TagOption[]
  filteredRegulatoryThemes: ThemeOption[]
  globalSearchText: string
  isAmpSearchResultsVisible: boolean
  isRegulatorySearchResultsVisible: boolean
  isVigilanceAreaSearchResultsVisible: boolean
  regulatoryLayersSearchResult: number[] | undefined
  searchExtent: number[] | undefined
  shouldFilterSearchOnMapExtent: boolean
}
const initialState: LayerSearchState = {
  ampsSearchResult: undefined,
  filteredAmpTypes: [],
  filteredRegulatoryTags: [],
  filteredRegulatoryThemes: [],
  globalSearchText: '',
  isAmpSearchResultsVisible: false,
  isRegulatorySearchResultsVisible: false,
  isVigilanceAreaSearchResultsVisible: false,
  regulatoryLayersSearchResult: undefined,
  searchExtent: undefined,
  shouldFilterSearchOnMapExtent: false
}

const layerSearchSlice = createSlice({
  initialState,
  name: 'layerSearch',
  reducers: {
    resetFilters(state) {
      state.filteredRegulatoryTags = []
      state.filteredRegulatoryThemes = []
      state.isRegulatorySearchResultsVisible = false
      state.filteredAmpTypes = []
      state.isAmpSearchResultsVisible = false
      state.isVigilanceAreaSearchResultsVisible = false
    },
    resetSearch(state) {
      return { state, ...initialState }
    },
    setAMPsSearchResult(state, action: PayloadAction<number[] | undefined>) {
      state.ampsSearchResult = action.payload
    },

    setFilteredAmpTypes(state, action: PayloadAction<string[]>) {
      state.filteredAmpTypes = action.payload
    },

    setFilteredRegulatoryTags(state, action: PayloadAction<TagOption[]>) {
      state.filteredRegulatoryTags = action.payload
    },

    setFilteredRegulatoryThemes(state, action: PayloadAction<ThemeOption[]>) {
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

    setIsVigilanceAreaSearchResultsVisible(state, action: PayloadAction<boolean>) {
      state.isVigilanceAreaSearchResultsVisible = action.payload
    },

    setRegulatoryLayersSearchResult(state, action: PayloadAction<number[] | undefined>) {
      state.regulatoryLayersSearchResult = action.payload
    },

    setSearchExtent(state, action: PayloadAction<number[] | undefined>) {
      state.searchExtent = action.payload
    },

    setShouldFilterSearchOnMapExtent(state, action: PayloadAction<boolean>) {
      state.shouldFilterSearchOnMapExtent = action.payload
    }
  }
})

export const {
  resetFilters,
  resetSearch,
  setAMPsSearchResult,
  setFilteredAmpTypes,
  setFilteredRegulatoryTags,
  setFilteredRegulatoryThemes,
  setGlobalSearchText,
  setIsAmpSearchResultsVisible,
  setIsRegulatorySearchResultsVisible,
  setIsVigilanceAreaSearchResultsVisible,
  setRegulatoryLayersSearchResult,
  setSearchExtent,
  setShouldFilterSearchOnMapExtent
} = layerSearchSlice.actions

export const layerSearchSliceReducer = layerSearchSlice.reducer
