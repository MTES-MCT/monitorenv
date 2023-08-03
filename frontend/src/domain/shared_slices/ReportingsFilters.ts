import { customDayjs as dayjs } from '@mtes-mct/monitor-ui'
import { createSlice } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import { dateRangeLabels } from '../entities/dateRange'
import { InfractionProvenEnum, StatusFilterEnum } from '../entities/reporting'

export const SEVEN_DAYS_AGO = dayjs().subtract(7, 'days').toISOString()

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
  THEME_FILTER = 'themeFilter',
  TYPE_FILTER = 'typeFilter'
}

type ReportingsFiltersSliceType = {
  actionsFilter: string[]
  hasFilters: boolean
  periodFilter: string
  provenFilter: string[]
  seaFrontFilter: string[]
  sourceFilter?: string[]
  sourceTypeFilter: string[]
  startedAfter?: string
  startedBefore?: string
  statusFilter: string[]
  themeFilter: string[]
  typeFilter?: string | undefined
}

const initialState: ReportingsFiltersSliceType = {
  actionsFilter: [],
  hasFilters: false,
  periodFilter: dateRangeLabels.WEEK.value,
  provenFilter: [InfractionProvenEnum.PROVEN, InfractionProvenEnum.NOT_PROVEN],
  seaFrontFilter: [],
  sourceFilter: [],
  sourceTypeFilter: [],
  startedAfter: SEVEN_DAYS_AGO,
  startedBefore: undefined,
  statusFilter: [StatusFilterEnum.IN_PROGRESS],
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
          state.periodFilter !== dateRangeLabels.WEEK.value ||
          state.seaFrontFilter.length > 0 ||
          state.statusFilter.length > 0 ||
          state.themeFilter.length > 0
      }
    }
  }
})

export const reportingsFiltersActions = reportingFiltersSlice.actions

export const reportingFiltersPersistedReducer = persistReducer(persistConfig, reportingFiltersSlice.reducer)
