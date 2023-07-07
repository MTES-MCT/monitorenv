import { createSlice } from '@reduxjs/toolkit'

type LayerSidebarSliceState = {
  administrativeZonesIsOpen: boolean
  baselayerIsOpen: boolean
  myAmpsIsOpen: boolean
  myRegulatoryZonesIsOpen: boolean
}

const initialState: LayerSidebarSliceState = {
  administrativeZonesIsOpen: false,
  baselayerIsOpen: false,
  myAmpsIsOpen: false,
  myRegulatoryZonesIsOpen: false
}

export const layerSidebarSlice = createSlice({
  initialState,
  name: 'layerSidebar',
  reducers: {
    toggleAdministrativeZones(state) {
      if (state.administrativeZonesIsOpen) {
        state.administrativeZonesIsOpen = false
      } else {
        state.administrativeZonesIsOpen = true
        state.baselayerIsOpen = false
        state.myAmpsIsOpen = false
        state.myRegulatoryZonesIsOpen = false
      }
    },
    toggleBaseLayer(state) {
      if (state.baselayerIsOpen) {
        state.baselayerIsOpen = false
      } else {
        state.administrativeZonesIsOpen = false
        state.baselayerIsOpen = true
        state.myAmpsIsOpen = false
        state.myRegulatoryZonesIsOpen = false
      }
    },
    toggleMyAmps(state) {
      if (state.myAmpsIsOpen) {
        state.myAmpsIsOpen = false
      } else {
        state.administrativeZonesIsOpen = false
        state.baselayerIsOpen = false
        state.myAmpsIsOpen = true
        state.myRegulatoryZonesIsOpen = false
      }
    },
    toggleMyRegulatoryZones(state) {
      if (state.myRegulatoryZonesIsOpen) {
        state.myRegulatoryZonesIsOpen = false
      } else {
        state.administrativeZonesIsOpen = false
        state.baselayerIsOpen = false
        state.myAmpsIsOpen = false
        state.myRegulatoryZonesIsOpen = true
      }
    }
  }
})

export const { toggleAdministrativeZones, toggleBaseLayer, toggleMyAmps, toggleMyRegulatoryZones } =
  layerSidebarSlice.actions
