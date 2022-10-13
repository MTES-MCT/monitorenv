import { createSlice } from '@reduxjs/toolkit'

/* eslint-disable */
/** @namespace RegulatoryMetadataReducer */
const RegulatoryMetadataReducer = null
/* eslint-enable */

const regulatoryMetadataSlice = createSlice({
  initialState: {
    loadingRegulatoryMetadata: false,
    regulatoryMetadata: null,
    regulatoryMetadataLayerId: null,
    regulatoryMetadataPanelIsOpen: false
  },
  name: 'regulatoryMetadata',
  reducers: {
    closeRegulatoryMetadataPanel(state) {
      state.regulatoryMetadataPanelIsOpen = false
      state.regulatoryMetadata = null
    },
    openRegulatoryMetadataPanel(state, action) {
      state.regulatoryMetadataPanelIsOpen = true
      state.regulatoryMetadataLayerId = action.payload
    },
    resetLoadingRegulatoryMetadata(state) {
      state.loadingRegulatoryMetadata = false
    },
    setLoadingRegulatoryMetadata(state) {
      state.loadingRegulatoryMetadata = true
      state.regulatoryMetadata = null
      state.regulatoryMetadataPanelIsOpen = true
    },
    setRegulatoryMetadata(state, action) {
      state.loadingRegulatoryMetadata = false
      state.regulatoryMetadata = action.payload
    }
  }
})

export const {
  closeRegulatoryMetadataPanel,
  openRegulatoryMetadataPanel,
  resetLoadingRegulatoryMetadata,
  setLoadingRegulatoryMetadata,
  setRegulatoryMetadata
} = regulatoryMetadataSlice.actions

export const regulatoryMetadataSliceReducer = regulatoryMetadataSlice.reducer
