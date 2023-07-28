/* eslint-disable typescript-sort-keys/interface */
/* eslint-disable sort-keys-fix/sort-keys-fix */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { ReportingFormVisibility } from './ReportingState'

import type { MapToolType } from '../entities/map/constants'

type Toast = {
  message: any
  type?: string
  containerId?: string
}
type GlobalStateType = {
  // state entry for every component /menu displayed on map whose visibility should be controlled
  displayMissionMenuButton: boolean
  displayDrawModal: boolean
  displayLayersSidebar: boolean
  displayLocateOnMap: boolean
  displayMeasurement: boolean
  displayInterestPoint: boolean
  displaySearchSemaphoreButton: boolean

  displayMissionsOverlay: boolean
  // state entry for every layer whose visibility should be controlled
  displayEditingMissionLayer: boolean
  displayMissionsLayer: boolean
  displaySelectedMissionLayer: boolean

  // state entry for other children components whom visibility is already handled by parent components
  missionsMenuIsOpen: boolean
  layersSidebarIsOpen: boolean

  isSearchSemaphoreVisible: boolean
  displaySemaphoresLayer: boolean
  displaySemaphoreOverlay: boolean

  mapToolOpened: MapToolType | undefined

  healthcheckTextWarning?: string

  overlayCoordinates: [number, number] | undefined

  toast: Toast | undefined

  displayReportingsLayer: boolean
  reportingFormVisibility: ReportingFormVisibility
  displaySelectedReportingLayer: boolean
}
const initialState: GlobalStateType = {
  // state entry for every component /menu displayed on map whose visibility should be controlled
  displayMissionMenuButton: true,
  displayDrawModal: false,
  displayLayersSidebar: true,
  displayLocateOnMap: true,
  displayMeasurement: true,
  displayInterestPoint: true,
  displaySearchSemaphoreButton: true,

  displayMissionsOverlay: true,
  // state entry for every layer whose visibility should be controlled
  displayEditingMissionLayer: true,
  displayMissionsLayer: true,
  displaySelectedMissionLayer: true,

  // state entry for other children components whom visibility is already handled by parent components
  missionsMenuIsOpen: false,
  layersSidebarIsOpen: false,

  isSearchSemaphoreVisible: false,
  displaySemaphoresLayer: true,
  displaySemaphoreOverlay: true,

  mapToolOpened: undefined,

  healthcheckTextWarning: undefined,

  overlayCoordinates: undefined,

  toast: undefined,

  reportingFormVisibility: ReportingFormVisibility.NOT_VISIBLE,
  displayReportingsLayer: true,
  displaySelectedReportingLayer: true
}

const globalSlice = createSlice({
  initialState,
  name: 'global',
  reducers: {
    removeToast(state) {
      state.toast = undefined
    },

    setToast(state, action) {
      state.toast = action.payload
    },

    setDisplayedItems(state, action) {
      return { ...state, ...action.payload }
    },

    setReportingFormVisibility(state, action) {
      state.reportingFormVisibility = action.payload
    },
    /**
     * Set the map tool opened
     */
    setMapToolOpened(state, action: PayloadAction<MapToolType | undefined>) {
      state.mapToolOpened = action.payload
    },

    /**
     * Set warning to show on application header
     * @param {Object} state
     * @param {{payload: string | null}} action - the warning(s) or null if no warning are found
     */
    setHealthcheckTextWarning(state, action) {
      state.healthcheckTextWarning = action.payload
    },
    setOverlayCoordinates(state, action) {
      state.overlayCoordinates = action.payload
    }
  }
})

export const {
  removeToast,
  setDisplayedItems,
  setHealthcheckTextWarning,
  setMapToolOpened,
  setOverlayCoordinates,
  setReportingFormVisibility,
  setToast
} = globalSlice.actions

export const globalReducer = globalSlice.reducer
