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
  menus: {
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
  }
  visibility: {
    isDashboardDialogVisible: boolean
    isSearchMissionsVisible: boolean
    isLayersSidebarVisible: boolean
    isAccountDialogVisible: boolean
    isControlUnitDialogVisible: boolean
    isControlUnitListDialogVisible: boolean
    isSearchSemaphoreVisible: boolean
    isSearchReportingsVisible: boolean
    reportingFormVisibility: ReportingFormVisibilityProps
    isMapToolVisible?: MapToolType
  }
  layers: {
    displayMissionEditingLayer: boolean
    displayMissionsLayer: boolean
    displayMissionSelectedLayer: boolean
    displayMissionToAttachLayer: boolean
    displayInterestPointLayer: boolean
    displayReportingToAttachLayer: boolean
    displayVigilanceAreaLayer: boolean
    displayDashboardLayer: boolean

    displayReportingsLayer: boolean
    displayReportingsOverlay: boolean
    displayReportingEditingLayer: boolean
    displayReportingSelectedLayer: boolean

    displayStationLayer: boolean
    isLayersSidebarVisible: boolean
    displaySemaphoresLayer: boolean
  }
  healthcheckTextWarning?: string
  overlayCoordinates: OverlayCoordinates[]
  toast?: Toast
  openedOverlayId?: string
  previousDisplayedItems: Record<string, any>
}
const initialState: GlobalStateType = {
  menus: {
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
    displayRightMenuControlUnitListButton: true
  },
  visibility: {
    isDashboardDialogVisible: false,
    isSearchMissionsVisible: false,
    isLayersSidebarVisible: false,
    isAccountDialogVisible: false,
    isControlUnitDialogVisible: false,
    isControlUnitListDialogVisible: false,
    isSearchSemaphoreVisible: false,
    isSearchReportingsVisible: false,
    reportingFormVisibility: {
      context: ReportingContext.MAP,
      visibility: VisibilityState.NONE
    }
  },
  layers: {
    displayMissionEditingLayer: true,
    displayMissionsLayer: true,
    displayMissionSelectedLayer: true,
    displayMissionToAttachLayer: true,
    displayInterestPointLayer: true,
    displayReportingToAttachLayer: true,
    displayVigilanceAreaLayer: true,
    displayDashboardLayer: false,

    displayReportingsLayer: true,
    displayReportingsOverlay: true,
    displayReportingEditingLayer: true,
    displayReportingSelectedLayer: true,

    displayStationLayer: false,
    isLayersSidebarVisible: true,
    displaySemaphoresLayer: true
  },

  overlayCoordinates: [],

  previousDisplayedItems: {}
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
      state.visibility.isAccountDialogVisible = false
      state.visibility.isControlUnitDialogVisible = false
      state.visibility.isControlUnitListDialogVisible = false
      state.visibility.isSearchReportingsVisible = false
      state.visibility.isSearchSemaphoreVisible = false
      state.visibility.isSearchMissionsVisible = false
      state.visibility.isMapToolVisible = undefined
      state.visibility.isDashboardDialogVisible = false
    },

    removeOverlayStroke(state) {
      state.overlayCoordinates = []
    },

    removeToast(state) {
      state.toast = undefined
    },

    restorePreviousDisplayedItems(state) {
      state.layers = state.previousDisplayedItems.layers
      state.menus = state.previousDisplayedItems.menus
      state.visibility = state.previousDisplayedItems.visibility
    },
    setDisplayedItems(
      state,
      action: PayloadAction<{
        layers?: Partial<GlobalStateType['layers']>
        menus?: Partial<GlobalStateType['menus']>
        visibility?: Partial<GlobalStateType['visibility']>
      }>
    ) {
      state.previousDisplayedItems = { layers: state.layers, menus: state.menus, visibility: state.visibility }

      state.layers = { ...state.layers, ...(action.payload.layers ?? {}) }
      state.menus = { ...state.menus, ...(action.payload.menus ?? {}) }
      state.visibility = { ...state.visibility, ...(action.payload.visibility ?? {}) }
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
      state.visibility.isMapToolVisible = action.payload
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
      state.visibility.reportingFormVisibility = action.payload
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
  restorePreviousDisplayedItems,
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
