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

type GlobalStateType = {
  healthcheckTextWarning?: string
  layers: {
    displayDashboardLayer: boolean
    displayInterestPointLayer: boolean
    displayMissionEditingLayer: boolean
    displayMissionSelectedLayer: boolean
    displayMissionToAttachLayer: boolean
    displayMissionsLayer: boolean
    displayReportingEditingLayer: boolean
    displayReportingSelectedLayer: boolean

    displayReportingToAttachLayer: boolean
    displayReportingsLayer: boolean
    displayReportingsOverlay: boolean
    displaySemaphoresLayer: boolean

    displayStationLayer: boolean
    displayVigilanceAreaLayer: boolean
    isLayersSidebarVisible: boolean
  }
  menus: {
    displayAccountButton: boolean
    displayDashboard: boolean
    displayDrawModal: boolean
    displayInterestPoint: boolean
    displayLayersSidebar: boolean
    displayLocateOnMap: boolean
    displayMeasurement: boolean
    displayMissionMenuButton: boolean
    displayReportingsButton: boolean
    displayRightMenuControlUnitListButton: boolean
    displaySearchSemaphoreButton: boolean
  }
  openedOverlayId?: string
  overlayCoordinates: OverlayCoordinates[]
  previousDisplayedItems: Record<string, any>
  toast?: Toast
  visibility: {
    isAccountDialogVisible: boolean
    isControlUnitDialogVisible: boolean
    isControlUnitListDialogVisible: boolean
    isDashboardDialogVisible: boolean
    isLayersSidebarVisible: boolean
    isMapToolVisible?: MapToolType
    isSearchMissionsVisible: boolean
    isSearchReportingsVisible: boolean
    isSearchSemaphoreVisible: boolean
    reportingFormVisibility: ReportingFormVisibilityProps
  }
}

const initialMenuState = {
  displayAccountButton: true,
  displayDashboard: true,
  displayDrawModal: false,
  displayInterestPoint: true,
  displayLayersSidebar: true,
  displayLocateOnMap: true,
  displayMeasurement: true,
  displayMissionMenuButton: true,
  displayReportingsButton: true,
  displayRightMenuControlUnitListButton: true,
  displaySearchSemaphoreButton: true
}

const initialLayers = {
  displayDashboardLayer: false,
  displayInterestPointLayer: true,
  displayMissionEditingLayer: true,
  displayMissionSelectedLayer: true,
  displayMissionsLayer: true,
  displayMissionToAttachLayer: true,
  displayReportingEditingLayer: true,
  displayReportingSelectedLayer: true,

  displayReportingsLayer: true,
  displayReportingsOverlay: true,
  displayReportingToAttachLayer: true,
  displaySemaphoresLayer: true,

  displayStationLayer: false,
  displayVigilanceAreaLayer: true,
  isLayersSidebarVisible: true
}

const initialVisibility = {
  isAccountDialogVisible: false,
  isControlUnitDialogVisible: false,
  isControlUnitListDialogVisible: false,
  isDashboardDialogVisible: false,
  isLayersSidebarVisible: false,
  isSearchMissionsVisible: false,
  isSearchReportingsVisible: false,
  isSearchSemaphoreVisible: false,
  reportingFormVisibility: {
    context: ReportingContext.MAP,
    visibility: VisibilityState.NONE
  }
}

const initialState: GlobalStateType = {
  layers: initialLayers,
  menus: initialMenuState,
  overlayCoordinates: [],

  previousDisplayedItems: {
    layers: initialLayers,
    menus: initialMenuState,
    visibility: initialVisibility
  },

  visibility: initialVisibility
}

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
      state.visibility = {
        ...state.previousDisplayedItems.visibility,
        reportingFormVisibility: state.visibility.reportingFormVisibility
      }
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
