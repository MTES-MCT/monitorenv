import { createSlice } from '@reduxjs/toolkit'

/* eslint-disable */
/** @namespace LayerSidebarReducer */
const LayerSidebarReducer = null
/* eslint-enable */

const layerSidebarSlice = createSlice({
  name: 'layerSidebar',
  initialState: {
    advancedSearchIsOpen: false,
    myRegulatoryZonesIsOpen: false,
    administrativeZonesIsOpen: false,
    baselayerIsOpen: false,
  },
  reducers: {
    toggleBaseLayer (state) {
      if (state.baselayerIsOpen) {
        state.baselayerIsOpen = false
      } else {
        state.advancedSearchIsOpen = false
        state.myRegulatoryZonesIsOpen = false
        state.administrativeZonesIsOpen = false
        state.baselayerIsOpen = true
      }
    },
    toggleMyRegulatoryZones (state) {
      if (state.myRegulatoryZonesIsOpen) {
        state.myRegulatoryZonesIsOpen = false
      } else {
        state.advancedSearchIsOpen = false
        state.myRegulatoryZonesIsOpen = true
        state.administrativeZonesIsOpen = false
        state.baselayerIsOpen = false
      }
    },
    toggleAdministrativeZones (state) {
      if (state.administrativeZonesIsOpen) {
        state.administrativeZonesIsOpen = false
      } else {
        state.advancedSearchIsOpen = false
        state.myRegulatoryZonesIsOpen = false
        state.administrativeZonesIsOpen = true
        state.baselayerIsOpen = false
      }
    }
  }
})

export const {
  toggleBaseLayer,
  toggleMyRegulatoryZones,
  toggleAdministrativeZones
} = layerSidebarSlice.actions

export default layerSidebarSlice.reducer
