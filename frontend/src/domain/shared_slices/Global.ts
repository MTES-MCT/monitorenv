// TODO This slice should disappear in favor of `features/MainWindow/slice.ts` and "Map" feature should have its own slice.
// TODO "Map" feature should have its own slice where we would transfer the related `display...` props.

import { createSelector, createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type { MapToolType } from '../entities/map/constants'
import type { Extent } from 'ol/extent'

export enum ReportingContext {
  MAP = 'map',
  SIDE_WINDOW = 'sideWindow'
}

export enum VisibilityState {
  NONE = 'none',
  REDUCED = 'reduced',
  VISIBLE = 'visible'
}

export type ReportingFormVisibilityProps = {
  context: ReportingContext
  visibility: VisibilityState
}
type Toast = {
  containerId?: string
  message: any
  type?: string
}

type OverlayCoordinates = {
  coordinates?: Extent
  name: string
}

/* eslint-disable sort-keys-fix/sort-keys-fix, typescript-sort-keys/interface */
type GlobalStateType = {
  // state entry for every component /menu displayed on map whose visibility should be controlled
  displayAccountButton: boolean
  displayMissionMenuButton: boolean
  displayDrawModal: boolean
  displayLayersSidebar: boolean
  displayLocateOnMap: boolean
  displayMeasurement: boolean
  displayInterestPoint: boolean
  displayDashboard: boolean
  displaySearchSemaphoreButton: boolean
  displayReportingsButton: boolean
  displayRightMenuControlUnitListButton: boolean

  // state entry for every layer whose visibility should be controlled
  isSearchMissionsVisible: boolean
  displayMissionEditingLayer: boolean
  displayMissionsLayer: boolean
  displayMissionSelectedLayer: boolean
  displayMissionToAttachLayer: boolean
  displayInterestPointLayer: boolean
  displayReportingToAttachLayer: boolean
  displayVigilanceAreaLayer: boolean
  displayDashboardLayer: boolean

  // state entry for other children components whom visibility is already handled by parent components

  isAccountDialogVisible: boolean

  isControlUnitDialogVisible: boolean
  isControlUnitListDialogVisible: boolean

  isSearchSemaphoreVisible: boolean
  displaySemaphoresLayer: boolean

  isSearchReportingsVisible: boolean
  reportingFormVisibility: ReportingFormVisibilityProps

  displayReportingsLayer: boolean
  displayReportingsOverlay: boolean
  displayReportingEditingLayer: boolean
  displayReportingSelectedLayer: boolean

  displayStationLayer: boolean

  isDashboardDialogVisible: boolean

  isLayersSidebarVisible: boolean

  isMapToolVisible?: MapToolType

  healthcheckTextWarning?: string

  overlayCoordinates: OverlayCoordinates[]

  toast?: Toast

  openedOverlayId?: string
}
const initialState: GlobalStateType = {
  // state entry for every component /menu displayed on map whose visibility should be controlled
  displayAccountButton: true,
  displayMissionMenuButton: true,
  displayDrawModal: false,
  displayLayersSidebar: true,
  displayLocateOnMap: true,
  displayMeasurement: true,
  displayInterestPoint: true,
  displayDashboard: true,
  displaySearchSemaphoreButton: true,
  displayReportingsButton: true,
  displayRightMenuControlUnitListButton: true,

  // state entry for every layer whose visibility should be controlled
  isSearchMissionsVisible: false,
  displayMissionsLayer: true,
  displayMissionEditingLayer: true,
  displayMissionSelectedLayer: true,
  displayMissionToAttachLayer: true,
  displayInterestPointLayer: true,
  displayReportingToAttachLayer: true,
  displayVigilanceAreaLayer: true,
  displayDashboardLayer: false,

  // state entry for other children components whom visibility is already handled by parent components
  isLayersSidebarVisible: false,

  // TODO Use `MainWindowDialog` or `MainWindowConfirmationModal`.
  isAccountDialogVisible: false,

  isControlUnitDialogVisible: false,
  isControlUnitListDialogVisible: false,

  isSearchSemaphoreVisible: false,
  displaySemaphoresLayer: true,

  isSearchReportingsVisible: false,
  reportingFormVisibility: {
    context: ReportingContext.MAP,
    visibility: VisibilityState.NONE
  },
  displayReportingsLayer: true,
  displayReportingsOverlay: true,
  displayReportingEditingLayer: true,
  displayReportingSelectedLayer: true,

  displayStationLayer: false,

  isDashboardDialogVisible: false,

  isMapToolVisible: undefined,

  healthcheckTextWarning: undefined,

  overlayCoordinates: [],

  toast: undefined,

  openedOverlayId: undefined
}
/* eslint-enable sort-keys-fix/sort-keys-fix, typescript-sort-keys/interface */

const globalSlice = createSlice({
  initialState,
  name: 'global',
  reducers: {
    closeOpenedOverlay(state) {
      state.openedOverlayId = 'NONE'
    },

    // TODO Rename to `hideAllDialogs`.
    hideSideButtons(state) {
      state.isAccountDialogVisible = false
      state.isControlUnitDialogVisible = false
      state.isControlUnitListDialogVisible = false
      state.isSearchReportingsVisible = false
      state.isSearchSemaphoreVisible = false
      state.isSearchMissionsVisible = false
      state.isMapToolVisible = undefined
      state.isDashboardDialogVisible = false
    },

    removeOverlayStroke(state) {
      state.overlayCoordinates = []
    },

    removeToast(state) {
      state.toast = undefined
    },

    resetLayoutToDefault(state) {
      state.displayDrawModal = false
      state.displayInterestPoint = true
      state.displayLayersSidebar = true
      state.displayLocateOnMap = true
      state.displayMeasurement = true
      state.displayMissionMenuButton = true
      state.displayReportingsButton = true
      state.displayReportingsOverlay = true
      state.displayRightMenuControlUnitListButton = true
      state.displaySearchSemaphoreButton = true
      state.displayDashboard = true
      state.displayDashboardLayer = false
    },

    setDisplayedItems(state, action: PayloadAction<Partial<GlobalStateType>>) {
      return { ...state, ...action.payload }
    },

    /**
     * Set warning to show on application header
     * @param {Object} state
     * @param {{payload: string | null}} action - the warning(s) or null if no warning are found
     */
    setHealthcheckTextWarning(state, action) {
      state.healthcheckTextWarning = action.payload
    },

    /**
     * Set the map tool opened
     */
    setIsMapToolVisible(state, action: PayloadAction<MapToolType | undefined>) {
      state.isMapToolVisible = action.payload
    },
    setOpenedOverlay(state, action: PayloadAction<string>) {
      const featureId = action.payload
      state.openedOverlayId = featureId
    },
    setOverlayCoordinates(state, action: PayloadAction<OverlayCoordinates>) {
      const { name } = action.payload
      const index = state.overlayCoordinates.findIndex(overlayCoordinate => overlayCoordinate.name === name)
      if (index === -1) {
        state.overlayCoordinates = [...state.overlayCoordinates, action.payload]
      } else {
        state.overlayCoordinates[index] = action.payload
      }
    },

    setReportingFormVisibility(state, action) {
      state.reportingFormVisibility = action.payload
    },

    setToast(state, action: PayloadAction<Toast>) {
      state.toast = action.payload
    }
  }
})

export const {
  closeOpenedOverlay,
  hideSideButtons,
  removeOverlayStroke,
  removeToast,
  resetLayoutToDefault,
  setDisplayedItems,
  setHealthcheckTextWarning,
  setIsMapToolVisible,
  setOpenedOverlay,
  setOverlayCoordinates,
  setReportingFormVisibility,
  setToast
} = globalSlice.actions

export const globalActions = globalSlice.actions
export const globalReducer = globalSlice.reducer

export const isOverlayOpened = createSelector(
  [(state: GlobalStateType) => state.openedOverlayId, (_, featureId: string) => featureId],
  (lastSelectedOverlayId, featureId) => lastSelectedOverlayId === featureId || !lastSelectedOverlayId
)

export const getOverlayCoordinates = createSelector(
  [(state: GlobalStateType) => state.overlayCoordinates, (_, featureId: string | undefined) => featureId],
  (overlayCoordinates, featureId) => overlayCoordinates.find(({ name }) => name === featureId)
)
