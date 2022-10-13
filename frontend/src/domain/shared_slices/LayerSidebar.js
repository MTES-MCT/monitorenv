import { createSlice } from '@reduxjs/toolkit'

/* eslint-disable */
/** @namespace LayerSidebarReducer */
const LayerSidebarReducer = null
/* eslint-enable */

const layerSidebarSlice = createSlice({
  initialState: {
    administrativeZonesIsOpen: false,
    baselayerIsOpen: false,
    myRegulatoryZonesIsOpen: false
  },
  name: 'layerSidebar',
  reducers: {
    toggleAdministrativeZones(state) {
      if (state.administrativeZonesIsOpen) {
        state.administrativeZonesIsOpen = false
      } else {
        state.myRegulatoryZonesIsOpen = false
        state.administrativeZonesIsOpen = true
        state.baselayerIsOpen = false
      }
    },
    toggleBaseLayer(state) {
      if (state.baselayerIsOpen) {
        state.baselayerIsOpen = false
      } else {
        state.myRegulatoryZonesIsOpen = false
        state.administrativeZonesIsOpen = false
        state.baselayerIsOpen = true
      }
    },
    toggleMyRegulatoryZones(state) {
      if (state.myRegulatoryZonesIsOpen) {
        state.myRegulatoryZonesIsOpen = false
      } else {
        state.myRegulatoryZonesIsOpen = true
        state.administrativeZonesIsOpen = false
        state.baselayerIsOpen = false
      }
    }
  }
})

export const { toggleAdministrativeZones, toggleBaseLayer, toggleMyRegulatoryZones } = layerSidebarSlice.actions

export default layerSidebarSlice.reducer
