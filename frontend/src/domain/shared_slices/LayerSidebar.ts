import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

type LayerSidebarSliceState = {
  administrativeZonesIsOpen: boolean
  areAmpsResultsOpen: boolean
  areMyVigilanceAreasOpen: boolean
  areRegFiltersOpen: boolean
  areRegulatoryResultsOpen: boolean
  baselayerIsOpen: boolean
  localizedAreasIsOpen: boolean
  myAmpsIsOpen: boolean
  myRegulatoryZonesIsOpen: boolean
  myVigilanceAreasIsOpen: boolean
}

const initialState: LayerSidebarSliceState = {
  administrativeZonesIsOpen: false,
  areAmpsResultsOpen: false,
  areMyVigilanceAreasOpen: false,
  areRegFiltersOpen: true,
  areRegulatoryResultsOpen: false,
  baselayerIsOpen: false,
  localizedAreasIsOpen: false,
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
    closeAllResultsList() {
      return {
        ...initialState,
        areAmpsResultsOpen: false,
        areMyVigilanceAreasOpen: false,
        areRegFiltersOpen: false,
        areRegulatoryResultsOpen: false
      }
    },
    toggleAdministrativeZones(state) {
      return {
        ...initialState,
        administrativeZonesIsOpen: !state.administrativeZonesIsOpen,
        areRegFiltersOpen: false
      }
    },
    toggleAmpResults(state, action: PayloadAction<boolean | undefined>) {
      return {
        ...initialState,
        areAmpsResultsOpen: action?.payload ?? !state.areAmpsResultsOpen,
        areRegFiltersOpen: false
      }
    },
    toggleBaseLayer(state) {
      return {
        ...initialState,
        areRegFiltersOpen: false,
        baselayerIsOpen: !state.baselayerIsOpen
      }
    },
    toggleLocalizedAreas(state) {
      return {
        ...initialState,
        areRegFiltersOpen: false,
        localizedAreasIsOpen: !state.localizedAreasIsOpen
      }
    },
    toggleMyAmps(state) {
      return {
        ...initialState,
        areRegFiltersOpen: false,
        myAmpsIsOpen: !state.myAmpsIsOpen
      }
    },
    toggleMyRegulatoryZones(state) {
      return {
        ...initialState,
        areRegFiltersOpen: false,
        myRegulatoryZonesIsOpen: !state.myRegulatoryZonesIsOpen
      }
    },
    toggleMyVigilanceAreas(state) {
      return {
        ...initialState,
        areRegFiltersOpen: false,
        myVigilanceAreasIsOpen: !state.myVigilanceAreasIsOpen
      }
    },
    toggleRegFilters(state, action: PayloadAction<boolean | undefined>) {
      const isChecked = action?.payload ?? !state.areRegFiltersOpen

      return {
        ...initialState,
        areRegFiltersOpen: isChecked
      }
    },
    toggleRegulatoryResults(state, action: PayloadAction<boolean | undefined>) {
      return {
        ...initialState,
        areRegFiltersOpen: false,
        areRegulatoryResultsOpen: action?.payload ?? !state.areRegulatoryResultsOpen
      }
    },
    toggleVigilanceAreaResults(state, action: PayloadAction<boolean | undefined>) {
      return {
        ...initialState,
        areMyVigilanceAreasOpen: action?.payload ?? !state.areMyVigilanceAreasOpen,
        areRegFiltersOpen: false
      }
    }
  }
})

export const layerSidebarActions = layerSidebarSlice.actions
