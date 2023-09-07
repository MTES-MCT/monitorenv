/* eslint-disable typescript-sort-keys/interface */
/* eslint-disable sort-keys-fix/sort-keys-fix */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import type { MapToolType } from '../entities/map/constants'

export enum ReportingContext {
  MAP = 'map',
  SIDE_WINDOW = 'sideWindow'
}

export enum VisibilityState {
  NONE = 'none',
  REDUCED = 'reduced',
  VISIBLE = 'visible',
  VISIBLE_LEFT = 'visible_left'
}

export type ReportingFormVisibilityProps = {
  context: ReportingContext
  visibility: VisibilityState
}
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
  isSearchMissionsVisible: boolean
  displayMissionsOverlay: boolean
  displayMissionEditingLayer: boolean
  displayMissionsLayer: boolean
  displayMissionSelectedLayer: boolean

  // state entry for other children components whom visibility is already handled by parent components

  isSearchSemaphoreVisible: boolean
  displaySemaphoresLayer: boolean
  displaySemaphoreOverlay: boolean

  isSearchReportingsVisible: boolean
  reportingFormVisibility: ReportingFormVisibilityProps

  displayReportingsLayer: boolean
  displayReportingsOverlay: boolean
  displayReportingEditingLayer: boolean
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

  // state entry for every layer whose visibility should be controlled
  isSearchMissionsVisible: false,
  displayMissionsLayer: true,
  displayMissionsOverlay: true,
  displayMissionEditingLayer: true,
  displayMissionSelectedLayer: true,

  // state entry for other children components whom visibility is already handled by parent components
  isLayersSidebarVisible: false,

  isSearchSemaphoreVisible: false,
  displaySemaphoresLayer: true,
  displaySemaphoreOverlay: true,

  isSearchReportingsVisible: false,
  reportingFormVisibility: {
    context: ReportingContext.MAP,
    visibility: VisibilityState.NONE
  },
  displayReportingsLayer: true,
  displayReportingsOverlay: true,
  displayReportingEditingLayer: true,
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
      state.isSearchMissionsVisible = false
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
    setIsMapToolVisible(state, action: PayloadAction<MapToolType | undefined>) {
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
  setIsMapToolVisible,
  setOverlayCoordinates,
  setReportingFormVisibility,
  setToast
} = globalSlice.actions

export const globalReducer = globalSlice.reducer
