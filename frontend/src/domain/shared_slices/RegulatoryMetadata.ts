import { createSlice } from '@reduxjs/toolkit'

const regulatoryMetadataSlice = createSlice({
  initialState: {
    loadingRegulatoryMetadata: false,
    regulatoryMetadata: undefined,
    regulatoryMetadataLayerId: undefined,
    regulatoryMetadataPanelIsOpen: false
  },
  name: 'regulatoryMetadata',
  reducers: {
    closeRegulatoryMetadataPanel(state) {
      state.regulatoryMetadataPanelIsOpen = false
      state.regulatoryMetadata = undefined
      state.regulatoryMetadataLayerId = undefined
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
      state.regulatoryMetadata = undefined
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
