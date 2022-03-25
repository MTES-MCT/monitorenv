import { createSlice } from '@reduxjs/toolkit'

/* eslint-disable */
/** @namespace RegulatoryMetadataReducer */
const RegulatoryMetadataReducer = null
/* eslint-enable */



const regulatoryMetadataSlice = createSlice({
  name: 'regulatoryMetadata',
  initialState: {
    regulatoryMetadata: null,
    loadingRegulatoryMetadata: false,
    regulatoryMetadataPanelIsOpen: false,
    regulatoryMetadataLayerId: null
  },
  reducers: {
    setLoadingRegulatoryMetadata (state) {
      state.loadingRegulatoryMetadata = true
      state.regulatoryMetadata = null
      state.regulatoryMetadataPanelIsOpen = true
    },
    resetLoadingRegulatoryMetadata (state) {
      state.loadingRegulatoryMetadata = false
    },
    setRegulatoryMetadata (state, action) {
      state.loadingRegulatoryMetadata = false
      state.regulatoryMetadata = action.payload
    },
    openRegulatoryMetadataPanel (state, action) {
      state.regulatoryMetadataPanelIsOpen = true
      state.regulatoryMetadataLayerId = action.payload
    },
    closeRegulatoryMetadataPanel (state) {
      state.regulatoryMetadataPanelIsOpen = false
      state.regulatoryMetadata = null
    },
  }
})

export const {
  setLoadingRegulatoryMetadata,
  resetLoadingRegulatoryMetadata,
  setRegulatoryMetadata,
  openRegulatoryMetadataPanel,
  closeRegulatoryMetadataPanel,
} = regulatoryMetadataSlice.actions



export const regulatoryMetadataSliceReducer = regulatoryMetadataSlice.reducer;
