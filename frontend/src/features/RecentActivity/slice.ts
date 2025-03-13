import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { isGeometryValid } from '@utils/geometryValidation'
import { InteractionType } from 'domain/entities/map/constants'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import { RecentActivity } from './types'

import type { GeoJSON } from 'domain/types/GeoJSON'

const persistConfig = {
  key: 'recentActivity',
  storage
}

export enum RecentActivityFiltersEnum {
  ADMINISTRATION_IDS = 'administrationIds',
  CONTROL_UNIT_IDS = 'controlUnitIds',
  GEOMETRY = 'geometry',
  INFRACTIONS_STATUS = 'infractionsStatus',
  PERIOD_FILTER = 'periodFilter',
  STARTED_AFTER = 'startedAfter',
  STARTED_BEFORE = 'startedBefore',
  THEME_IDS = 'themeIds'
}

export type RecentActivityState = {
  distinctionFilter: RecentActivity.DistinctionFilterEnum
  distinctionFiltersItems: {
    infractions: {
      withInfraction: number
      withoutInfraction: number
    }
  }
  drawedGeometry: GeoJSON.MultiPolygon | undefined
  filters: {
    administrationIds?: number[]
    controlUnitIds?: number[]
    geometry?: GeoJSON.MultiPolygon
    infractionsStatus?: RecentActivity.StatusFilterEnum[]
    periodFilter: string
    startedAfter?: string
    startedBefore?: string
    themeIds?: number[]
  }
  initialGeometry: GeoJSON.MultiPolygon | undefined
  interactionType: InteractionType
  isDrawing: boolean
  isGeometryValid: boolean
}

const INITIAL_STATE: RecentActivityState = {
  distinctionFilter: RecentActivity.DistinctionFilterEnum.WITHOUT_DISTINCTION,
  distinctionFiltersItems: {
    infractions: {
      withInfraction: 0,
      withoutInfraction: 0
    }
  },
  drawedGeometry: undefined,
  filters: {
    infractionsStatus: [
      RecentActivity.StatusFilterEnum.WITH_INFRACTION,
      RecentActivity.StatusFilterEnum.WITHOUT_INFRACTION
    ],
    periodFilter: RecentActivity.RecentActivityDateRangeEnum.THIRTY_LAST_DAYS,
    startedAfter: undefined,
    startedBefore: undefined
  },
  initialGeometry: undefined,
  interactionType: InteractionType.POLYGON,
  isDrawing: false,
  isGeometryValid: true
}
const recentActivitySlice = createSlice({
  initialState: INITIAL_STATE,
  name: 'recentActivity',
  reducers: {
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
    setIsDrawing(state: RecentActivityState, action: PayloadAction<boolean>) {
      state.isDrawing = action.payload
    },
    updateDistinctionFilter(state: RecentActivityState, action: PayloadAction<RecentActivity.DistinctionFilterEnum>) {
      state.distinctionFilter = action.payload
    },
    updateDistinctionFiltersItems(
      state: RecentActivityState,
      action: PayloadAction<RecentActivityState['distinctionFiltersItems']>
    ) {
      state.distinctionFiltersItems = {
        ...state.distinctionFiltersItems,
        ...action.payload
      }
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
