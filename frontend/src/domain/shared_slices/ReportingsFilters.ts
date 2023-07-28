import { createSlice } from '@reduxjs/toolkit'
import dayjs from 'dayjs'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import { dateRangeLabels } from '../entities/dateRange'

export const SEVEN_DAYS_AGO = dayjs().subtract(7, 'days').toISOString()

export enum ReportingsFiltersEnum {
  PERIOD_FILTER = 'periodFilter',
  SEA_FRONT_FILTER = 'seaFrontFilter',
  SOURCE_FILTER = 'sourceFilter',
  STARTED_AFTER_FILTER = 'startedAfter',
  STARTED_BEFORE_FILTER = 'startedBefore',
  STATUS_FILTER = 'statusFilter',
  THEME_FILTER = 'themeFilter',
  UNIT_FILTER = 'unitFilter'
}

type ReportingsFiltersSliceType = {
  hasFilters: boolean
  periodFilter: string
  seaFrontFilter: string[]
  sourceFilter: string | undefined
  startedAfter?: string
  startedBefore?: string
  statusFilter: string[]
  themeFilter: string[]
  unitFilter: string[]
}

const initialState: ReportingsFiltersSliceType = {
  hasFilters: false,
  periodFilter: dateRangeLabels.WEEK.value,
  seaFrontFilter: [],
  sourceFilter: undefined,
  startedAfter: SEVEN_DAYS_AGO,
  startedBefore: undefined,
  statusFilter: [],
  themeFilter: [],
  unitFilter: []
}

const persistConfig = {
  key: 'reportingsFilters',
  storage
}

const reportingFiltersSlice = createSlice({
  initialState,
  name: 'reportingsFilters',
  reducers: {
    resetReportingsFilters() {
      return { ...initialState }
    },
    updateFilters(state, action) {
      return {
        ...state,
        [action.payload.key]: action.payload.value,
        hasFilters:
          (action.payload.value && action.payload.value.length > 0) ||
          state.periodFilter !== dateRangeLabels.WEEK.value ||
          state.unitFilter.length > 0 ||
          state.seaFrontFilter.length > 0 ||
          state.statusFilter.length > 0 ||
          state.themeFilter.length > 0
      }
    }
  }
})

export const { resetReportingsFilters, updateFilters } = reportingFiltersSlice.actions

export const reportingFiltersPersistedReducer = persistReducer(persistConfig, reportingFiltersSlice.reducer)
