import { createSlice } from '@reduxjs/toolkit'
import _ from 'lodash'

type RegulatoryLayerSearchState = {
  regulatoryLayersSearchResult: any
  searchExtent: number[] | undefined
}
const initialState: RegulatoryLayerSearchState = {
  regulatoryLayersSearchResult: undefined,
  searchExtent: undefined
}

const regulatoryLayerSearchSlice = createSlice({
  initialState,
  name: 'regulatoryLayerSearch',
  reducers: {
    /**
     * Set the selected zone to filter regulations
     * @param {Object=} state
     */
    resetSearchExtent(state) {
      state.searchExtent = undefined
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

export const { resetSearchExtent, setRegulatoryLayersSearchResult, setSearchExtent } =
  regulatoryLayerSearchSlice.actions

export const regulatoryLayerSearchSliceReducer = regulatoryLayerSearchSlice.reducer
