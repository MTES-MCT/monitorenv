import { createSlice } from '@reduxjs/toolkit'

type LayerSidebarSliceState = {
  administrativeZonesIsOpen: boolean
  areRegFiltersOpen: boolean
  baselayerIsOpen: boolean
  myAmpsIsOpen: boolean
  myRegulatoryZonesIsOpen: boolean
}

const initialState: LayerSidebarSliceState = {
  administrativeZonesIsOpen: false,
  areRegFiltersOpen: false,
  baselayerIsOpen: false,
  myAmpsIsOpen: false,
  myRegulatoryZonesIsOpen: false
}

export const layerSidebarSlice = createSlice({
  initialState,
  name: 'layerSidebar',
  reducers: {
    closeAll() {
      return { ...initialState }
    },
    toggleAdministrativeZones(state) {
      if (state.administrativeZonesIsOpen) {
        state.administrativeZonesIsOpen = false
      } else {
        state.administrativeZonesIsOpen = true
        state.areRegFiltersOpen = false
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
        state.areRegFiltersOpen = false
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
        state.areRegFiltersOpen = false
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
        state.areRegFiltersOpen = false
        state.baselayerIsOpen = false
        state.myAmpsIsOpen = false
        state.myRegulatoryZonesIsOpen = true
      }
    },
    toggleRegFilters(state) {
      state.areRegFiltersOpen = !state.areRegFiltersOpen
      state.administrativeZonesIsOpen = false
      state.baselayerIsOpen = false
      state.myAmpsIsOpen = false
      state.myRegulatoryZonesIsOpen = false
    }
  }
})

export const layerSidebarActions = layerSidebarSlice.actions
