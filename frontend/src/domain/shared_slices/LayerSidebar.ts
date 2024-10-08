import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

type LayerSidebarSliceState = {
  administrativeZonesIsOpen: boolean
  areAmpsResultsOpen: boolean
  areMyVigilanceAreasOpen: boolean
  areRegFiltersOpen: boolean
  areRegulatoryResultsOpen: boolean
  baselayerIsOpen: boolean
  myAmpsIsOpen: boolean
  myRegulatoryZonesIsOpen: boolean
  myVigilanceAreasIsOpen: boolean
}

const initialState: LayerSidebarSliceState = {
  administrativeZonesIsOpen: false,
  areAmpsResultsOpen: false,
  areMyVigilanceAreasOpen: false,
  areRegFiltersOpen: false,
  areRegulatoryResultsOpen: false,
  baselayerIsOpen: false,
  myAmpsIsOpen: false,
  myRegulatoryZonesIsOpen: false,
  myVigilanceAreasIsOpen: false
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
    toggleAmpResults(state, action: PayloadAction<boolean | undefined>) {
      return {
        ...initialState,
        areAmpsResultsOpen: action?.payload ?? !state.areAmpsResultsOpen
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
    toggleMyVigilanceAreas(state) {
      return {
        ...initialState,
        myVigilanceAreasIsOpen: !state.myVigilanceAreasIsOpen
      }
    },
    toggleRegFilters(state) {
      return {
        ...initialState,
        areRegFiltersOpen: !state.areRegFiltersOpen
      }
    },
    toggleRegulatoryResults(state, action: PayloadAction<boolean | undefined>) {
      return {
        ...initialState,
        areRegulatoryResultsOpen: action?.payload ?? !state.areRegulatoryResultsOpen
      }
    },
    toggleVigilanceAreaResults(state, action: PayloadAction<boolean | undefined>) {
      return {
        ...initialState,
        areMyVigilanceAreasOpen: action?.payload ?? !state.areMyVigilanceAreasOpen
      }
    }
  }
})

export const layerSidebarActions = layerSidebarSlice.actions
