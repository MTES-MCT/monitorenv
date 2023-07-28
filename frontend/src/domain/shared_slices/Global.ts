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
  displayReportingsButton: boolean

  // state entry for every layer whose visibility should be controlled
  isSearchMissions: boolean
  displayMissionsOverlay: boolean
  displayMissionEditingLayer: boolean
  displayMissionsLayer: boolean
  displayMissionSelectedLayer: boolean

  // state entry for other children components whom visibility is already handled by parent components

  isSearchSemaphoreVisible: boolean
  displaySemaphoresLayer: boolean
  displaySemaphoreOverlay: boolean

  isSearchReportingsVisible: boolean
  reportingFormVisibility: ReportingFormVisibility
  displayReportingsLayer: boolean
  displayReportingsOverlay: boolean
  displayReportingSelectedLayer: boolean

  isLayersSidebarVisible: boolean

  isMapToolVisible: MapToolType | undefined

  healthcheckTextWarning?: string

  overlayCoordinates: [number, number] | undefined

  toast: Toast | undefined
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
  displayReportingsButton: true,

  displayMissionsOverlay: true,
  // state entry for every layer whose visibility should be controlled
  displayMissionEditingLayer: true,
  displayMissionsLayer: true,
  displayMissionSelectedLayer: true,

  // state entry for other children components whom visibility is already handled by parent components
  isSearchMissions: false,
  isLayersSidebarVisible: false,

  isSearchSemaphoreVisible: false,
  displaySemaphoresLayer: true,
  displaySemaphoreOverlay: true,

  isSearchReportingsVisible: false,
  reportingFormVisibility: ReportingFormVisibility.NONE,
  displayReportingsLayer: true,
  displayReportingsOverlay: true,
  displayReportingSelectedLayer: true,

  isMapToolVisible: undefined,

  healthcheckTextWarning: undefined,

  overlayCoordinates: undefined,

  toast: undefined
}

const globalSlice = createSlice({
  initialState,
  name: 'global',
  reducers: {
    hideSideButtons(state) {
      state.isSearchReportingsVisible = false
      state.isSearchSemaphoreVisible = false
      state.isSearchMissions = false
      state.isMapToolVisible = undefined
    },
    removeToast(state) {
      state.toast = undefined
    },

    setToast(state, action) {
      state.toast = action.payload
    },

    setDisplayedItems(state, action: PayloadAction<Partial<GlobalStateType>>) {
      return { ...state, ...action.payload }
    },

    setReportingFormVisibility(state, action) {
      state.reportingFormVisibility = action.payload
    },
    /**
     * Set the map tool opened
     */
    setisMapToolVisible(state, action: PayloadAction<MapToolType | undefined>) {
      state.isMapToolVisible = action.payload
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
  hideSideButtons,
  removeToast,
  setDisplayedItems,
  setHealthcheckTextWarning,
  setisMapToolVisible,
  setOverlayCoordinates,
  setReportingFormVisibility,
  setToast
} = globalSlice.actions

export const globalReducer = globalSlice.reducer
