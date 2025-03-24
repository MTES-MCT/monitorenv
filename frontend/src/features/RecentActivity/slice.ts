import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { isGeometryValid } from '@utils/geometryValidation'
import { InteractionType } from 'domain/entities/map/constants'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import { RecentActivity } from './types'

import type { GeoJSON } from 'domain/types/GeoJSON'
import type { OverlayItem } from 'domain/types/map'
import type { Coordinate } from 'ol/coordinate'

const persistConfig = {
  blacklist: ['drawedGeometry', 'isDrawing', 'isGeometryValid', 'isLegendOpen', 'initialGeometry', 'layersAndOverlays'],
  key: 'recentActivity',
  storage
}

export enum RecentActivityFiltersEnum {
  ADMINISTRATION_IDS = 'administrationIds',
  CONTROL_UNIT_IDS = 'controlUnitIds',
  GEOMETRY = 'geometry',
  PERIOD_FILTER = 'periodFilter',
  STARTED_AFTER = 'startedAfter',
  STARTED_BEFORE = 'startedBefore',
  THEME_IDS = 'themeIds'
}

export type RecentActivityState = {
  drawedGeometry: GeoJSON.MultiPolygon | undefined
  filters: {
    administrationIds?: number[]
    controlUnitIds?: number[]
    geometry?: GeoJSON.MultiPolygon
    periodFilter: string
    startedAfter?: string
    startedBefore?: string
    themeIds?: number[]
  }
  initialGeometry: GeoJSON.MultiPolygon | undefined
  interactionType: InteractionType
  isDrawing: boolean
  isGeometryValid: boolean
  isLegendOpen: boolean
  layersAndOverlays: {
    isControlsListClicked: boolean
    layerOverlayCoordinates: Coordinate | undefined
    layerOverlayItems: OverlayItem<string, RecentActivity.RecentControlsActivity>[] | undefined
    selectedControlId: string | undefined
  }
}

const INITIAL_STATE: RecentActivityState = {
  drawedGeometry: undefined,
  filters: {
    periodFilter: RecentActivity.RecentActivityDateRangeEnum.THIRTY_LAST_DAYS,
    startedAfter: undefined,
    startedBefore: undefined
  },
  initialGeometry: undefined,
  interactionType: InteractionType.POLYGON,
  isDrawing: false,
  isGeometryValid: true,
  isLegendOpen: false,
  layersAndOverlays: {
    isControlsListClicked: false,
    layerOverlayCoordinates: undefined,
    layerOverlayItems: undefined,
    selectedControlId: undefined
  }
}
const recentActivitySlice = createSlice({
  initialState: INITIAL_STATE,
  name: 'recentActivity',
  reducers: {
    resetControlListOverlay(state: RecentActivityState) {
      state.layersAndOverlays.layerOverlayItems = undefined
      state.layersAndOverlays.isControlsListClicked = false
      state.layersAndOverlays.layerOverlayCoordinates = undefined
    },
    resetRecentActivityFilters() {
      return { ...INITIAL_STATE }
    },
    setGeometry(state: RecentActivityState, action: PayloadAction<GeoJSON.MultiPolygon | undefined>) {
      state.drawedGeometry = action.payload
      state.isGeometryValid = action.payload ? isGeometryValid(action.payload) : true
    },
    setInitialGeometry(state: RecentActivityState, action: PayloadAction<GeoJSON.MultiPolygon | undefined>) {
      state.initialGeometry = action.payload
    },
    setInteractionType(state: RecentActivityState, action: PayloadAction<InteractionType>) {
      state.interactionType = action.payload
    },
    setIsControlsListClicked(state: RecentActivityState, action: PayloadAction<boolean>) {
      state.layersAndOverlays.isControlsListClicked = action.payload
    },
    setIsDrawing(state: RecentActivityState, action: PayloadAction<boolean>) {
      state.isDrawing = action.payload
    },
    setIsLegenOpen(state: RecentActivityState, action: PayloadAction<boolean>) {
      state.isLegendOpen = action.payload
    },
    setLayerOverlayCoordinates(state: RecentActivityState, action: PayloadAction<Coordinate | undefined>) {
      state.layersAndOverlays.layerOverlayCoordinates = action.payload
    },
    setLayerOverlayItems(
      state: RecentActivityState,
      action: PayloadAction<OverlayItem<string, RecentActivity.RecentControlsActivity>[] | undefined>
    ) {
      state.layersAndOverlays.layerOverlayItems = action.payload
    },
    setSelectedControlId(state: RecentActivityState, action: PayloadAction<string | undefined>) {
      state.layersAndOverlays.selectedControlId = action.payload
    },
    updateFilters(
      state: RecentActivityState,
      action: PayloadAction<{
        key: string
        value: RecentActivityState['filters'][keyof RecentActivityState['filters']]
      }>
    ) {
      state.filters = {
        ...state.filters,
        [action.payload.key]: action.payload.value
      }
    }
  }
})

export const recentActivityActions = recentActivitySlice.actions
export const recentActivityPersitedReducer = persistReducer(persistConfig, recentActivitySlice.reducer)
