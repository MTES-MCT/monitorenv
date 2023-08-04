import { customDayjs } from '@mtes-mct/monitor-ui'
import { createSlice } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import { reportingDateRangeLabels } from '../entities/dateRange'
import { /* InfractionProvenEnum, */ StatusFilterEnum } from '../entities/reporting'

export const LAST_24_HOURS = customDayjs.utc().subtract(24, 'hour').toISOString()

export enum ReportingsFiltersEnum {
  ACTIONS = 'actionsFilter',
  PERIOD_FILTER = 'periodFilter',
  PROVEN_FILTER = 'provenFilter',
  SEA_FRONT_FILTER = 'seaFrontFilter',
  SOURCE_FILTER = 'sourceFilter',
  SOURCE_TYPE_FILTER = 'sourceTypeFilter',
  STARTED_AFTER_FILTER = 'startedAfter',
  STARTED_BEFORE_FILTER = 'startedBefore',
  STATUS_FILTER = 'statusFilter',
  SUB_THEMES_FILTER = 'subThemesFilter',
  THEME_FILTER = 'themeFilter',
  TYPE_FILTER = 'typeFilter'
}

type ReportingsFiltersSliceType = {
  actionsFilter?: string[]
  hasFilters: boolean
  periodFilter: string
  provenFilter: string[]
  seaFrontFilter: string[]
  sourceFilter: string[]
  sourceTypeFilter: string[]
  startedAfter: string
  startedBefore?: string
  statusFilter: string[]
  subThemesFilter: string[]
  themeFilter: string[]
  typeFilter?: string | undefined
}

const initialState: ReportingsFiltersSliceType = {
  actionsFilter: [],
  hasFilters: false,
  periodFilter: reportingDateRangeLabels.DAY.value,
  provenFilter: [], // [InfractionProvenEnum.PROVEN, InfractionProvenEnum.NOT_PROVEN],
  seaFrontFilter: [],
  sourceFilter: [],
  sourceTypeFilter: [],
  startedAfter: LAST_24_HOURS,
  startedBefore: undefined,
  statusFilter: [StatusFilterEnum.IN_PROGRESS],
  subThemesFilter: [],
  themeFilter: [],
  typeFilter: undefined
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
          state.periodFilter !== reportingDateRangeLabels.DAY.value ||
          state.sourceTypeFilter.length > 0 ||
          state.typeFilter !== undefined ||
          state.seaFrontFilter.length > 0 ||
          state.statusFilter.length > 0 ||
          state.themeFilter.length > 0 ||
          state.subThemesFilter.length > 0
      }
    }
  }
})

export const reportingsFiltersActions = reportingFiltersSlice.actions

export const reportingFiltersPersistedReducer = persistReducer(persistConfig, reportingFiltersSlice.reducer)
