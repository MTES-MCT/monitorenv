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
      return {
        ...initialState,
        administrativeZonesIsOpen: !state.administrativeZonesIsOpen
      }
    },
    toggleBaseLayer(state) {
      return {
        ...initialState,
        baselayerIsOpen: !state.baselayerIsOpen
      }
    },
    toggleMyAmps(state) {
      return {
        ...initialState,
        myAmpsIsOpen: !state.myAmpsIsOpen
      }
    },
    toggleMyRegulatoryZones(state) {
      return {
        ...initialState,
        myRegulatoryZonesIsOpen: !state.myRegulatoryZonesIsOpen
      }
    },
    toggleRegFilters(state) {
      return {
        ...initialState,
        areRegFiltersOpen: !state.areRegFiltersOpen
      }
    }
  }
})

export const layerSidebarActions = layerSidebarSlice.actions
