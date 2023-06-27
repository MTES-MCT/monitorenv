import { PayloadAction, createSlice } from '@reduxjs/toolkit'

type LayerSearchState = {
  ampsSearchResult: number[] | undefined
  isAmpSearchResultsExpanded: boolean
  isAmpSearchResultsVisible: boolean
  isRegulatorySearchResultsExpanded: boolean
  isRegulatorySearchResultsVisible: boolean
  regulatoryLayersSearchResult: number[] | undefined
  searchExtent: number[] | undefined
}
const initialState: LayerSearchState = {
  ampsSearchResult: undefined,
  isAmpSearchResultsExpanded: false,
  isAmpSearchResultsVisible: false,
  isRegulatorySearchResultsExpanded: false,
  isRegulatorySearchResultsVisible: false,
  regulatoryLayersSearchResult: undefined,
  searchExtent: undefined
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

    setIsAmpSearchResultsExpanded(state, action: PayloadAction<boolean>) {
      state.isAmpSearchResultsExpanded = action.payload
    },

    setIsAmpSearchResultsVisible(state, action: PayloadAction<boolean>) {
      state.isAmpSearchResultsVisible = action.payload
    },
    setIsRegulatorySearchResultsExpanded(state, action: PayloadAction<boolean>) {
      state.isRegulatorySearchResultsExpanded = action.payload
    },

    setIsRegulatorySearchResultsVisible(state, action: PayloadAction<boolean>) {
      state.isRegulatorySearchResultsVisible = action.payload
    },
    /**
     * Set regulatory layers search result structured as
     * LawType: {
     *   Topic: Zone[]
     * }
     * @param {Object} state
     * @param {RegulatoryLawTypes | null} action - The regulatory search result
     */
    setRegulatoryLayersSearchResult(state, action) {
      state.regulatoryLayersSearchResult = action.payload
    },

    /**
     * Set the selected zone to filter regulations
     * @param {Object} state
     * @param {{
     * payload: {
     *  name: string,
     *  code: string,
     *  feature: GeoJSON
     * }}} action - The zone
     */
    setSearchExtent(state, action) {
      state.searchExtent = action.payload
    }
  }
})

export const {
  resetSearchExtent,
  setAMPsSearchResult,
  setIsAmpSearchResultsExpanded,
  setIsAmpSearchResultsVisible,
  setIsRegulatorySearchResultsExpanded,
  setIsRegulatorySearchResultsVisible,
  setRegulatoryLayersSearchResult,
  setSearchExtent
} = layerSearchSlice.actions

export const layerSearchSliceReducer = layerSearchSlice.reducer
