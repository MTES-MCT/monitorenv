import { VigilanceArea } from '@features/VigilanceArea/types'
import { type PayloadAction, createSlice } from '@reduxjs/toolkit'

import type { DateAsStringRange } from '@mtes-mct/monitor-ui'
import type { TagFromAPI } from 'domain/entities/tags'
import type { ThemeFromAPI } from 'domain/entities/themes'

type LayerSearchState = {
  ampsSearchResult: number[] | undefined
  filteredAmpTypes: string[]
  filteredRegulatoryTags: TagFromAPI[]
  filteredRegulatoryThemes: ThemeFromAPI[]
  filteredVigilanceAreaPeriod: VigilanceArea.VigilanceAreaFilterPeriod | undefined
  globalSearchText: string
  isAmpSearchResultsVisible: boolean
  isRegulatorySearchResultsVisible: boolean
  isVigilanceAreaSearchResultsVisible: boolean
  regulatoryLayersSearchResult: number[] | undefined
  searchExtent: number[] | undefined
  shouldFilterSearchOnMapExtent: boolean
  vigilanceAreaSearchResult: number[] | undefined
  vigilanceAreaSpecificPeriodFilter: DateAsStringRange | undefined
}
const initialState: LayerSearchState = {
  ampsSearchResult: undefined,
  filteredAmpTypes: [],
  filteredRegulatoryTags: [],
  filteredRegulatoryThemes: [],
  filteredVigilanceAreaPeriod: VigilanceArea.VigilanceAreaFilterPeriod.NEXT_THREE_MONTHS,
  globalSearchText: '',
  isAmpSearchResultsVisible: false,
  isRegulatorySearchResultsVisible: false,
  isVigilanceAreaSearchResultsVisible: false,
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
    resetFilters(state) {
      state.filteredRegulatoryTags = []
      state.filteredRegulatoryThemes = []
      state.isRegulatorySearchResultsVisible = false
      state.filteredAmpTypes = []
      state.isAmpSearchResultsVisible = false
      state.filteredVigilanceAreaPeriod = VigilanceArea.VigilanceAreaFilterPeriod.NEXT_THREE_MONTHS
      state.vigilanceAreaSpecificPeriodFilter = undefined
      state.isVigilanceAreaSearchResultsVisible = false
    },
    resetSearch(state) {
      state.regulatoryLayersSearchResult = undefined
      state.isRegulatorySearchResultsVisible = false
      state.filteredRegulatoryTags = []
      state.filteredRegulatoryThemes = []
      state.ampsSearchResult = undefined
      state.isAmpSearchResultsVisible = false
      state.filteredAmpTypes = []
      state.vigilanceAreaSearchResult = undefined
      state.isVigilanceAreaSearchResultsVisible = false
      state.vigilanceAreaSpecificPeriodFilter = undefined
      state.filteredVigilanceAreaPeriod = VigilanceArea.VigilanceAreaFilterPeriod.NEXT_THREE_MONTHS
      state.shouldFilterSearchOnMapExtent = false
      state.globalSearchText = ''
      state.searchExtent = undefined
    },

    /**
     * Set the selected zone to filter regulations
     * @param {Object=} state
     */
    resetSearchExtent(state) {
      state.searchExtent = undefined
    },

    setAMPsSearchResult(state, action: PayloadAction<number[] | undefined>) {
      state.ampsSearchResult = action.payload
    },

    setFilteredAmpTypes(state, action: PayloadAction<string[]>) {
      state.filteredAmpTypes = action.payload
    },

    setFilteredRegulatoryTags(state, action: PayloadAction<TagFromAPI[]>) {
      state.filteredRegulatoryTags = action.payload
    },

    setFilteredRegulatoryThemes(state, action: PayloadAction<ThemeFromAPI[]>) {
      state.filteredRegulatoryThemes = action.payload
    },

    setFilteredVigilanceAreaPeriod(state, action: PayloadAction<VigilanceArea.VigilanceAreaFilterPeriod | undefined>) {
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

    setRegulatoryLayersSearchResult(state, action: PayloadAction<number[] | undefined>) {
      state.regulatoryLayersSearchResult = action.payload
    },

    setSearchExtent(state, action: PayloadAction<number[] | undefined>) {
      state.searchExtent = action.payload
    },

    setShouldFilterSearchOnMapExtent(state, action: PayloadAction<boolean>) {
      state.shouldFilterSearchOnMapExtent = action.payload
    },

    setVigilanceAreaSpecificPeriodFilter(state, action: PayloadAction<DateAsStringRange | undefined>) {
      state.vigilanceAreaSpecificPeriodFilter = action.payload
    },
    setVigilanceAreasSearchResult(state, action: PayloadAction<number[] | undefined>) {
      state.vigilanceAreaSearchResult = action.payload
    }
  }
})

export const {
  resetFilters,
  resetSearch,
  resetSearchExtent,
  setAMPsSearchResult,
  setFilteredAmpTypes,
  setFilteredRegulatoryTags,
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
