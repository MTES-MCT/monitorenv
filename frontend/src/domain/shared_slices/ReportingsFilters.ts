import { customDayjs } from '@mtes-mct/monitor-ui'
import { createSlice } from '@reduxjs/toolkit'
import { isEqual, omit } from 'lodash'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import { ReportingDateRangeEnum } from '../entities/dateRange'
import { StatusFilterEnum } from '../entities/reporting'

export const LAST_30_DAYS = customDayjs.utc().subtract(30, 'day').toISOString()

export type SourceFilterProps = {
  id: number
  label: string
}
export enum ReportingsFiltersEnum {
  ACTIONS = 'actionsFilter',
  IS_ATTACHED_TO_MISSION_FILTER = 'isAttachedToMissionFilter',
  IS_UNATTACHED_TO_MISSION_FILTER = 'isUnattachedToMissionFilter',
  PERIOD_FILTER = 'periodFilter',
  SEARCH_QUERY_FILTER = 'searchQueryFilter',
  SEA_FRONT_FILTER = 'seaFrontFilter',
  SOURCE_FILTER = 'sourceFilter',
  SOURCE_TYPE_FILTER = 'sourceTypeFilter',
  STARTED_AFTER_FILTER = 'startedAfter',
  STARTED_BEFORE_FILTER = 'startedBefore',
  STATUS_FILTER = 'statusFilter',
  SUB_THEMES_FILTER = 'subThemesFilter',
  TARGET_TYPE_FILTER = 'targetTypeFilter',
  THEME_FILTER = 'themeFilter',
  TYPE_FILTER = 'typeFilter'
}

type ReportingsFiltersSliceType = {
  actionsFilter?: string[]
  hasFilters: boolean
  isAttachedToMissionFilter?: boolean
  isUnattachedToMissionFilter?: boolean
  periodFilter: string
  seaFrontFilter: string[] | undefined
  searchQueryFilter: string | undefined
  sourceFilter: SourceFilterProps[] | undefined
  sourceTypeFilter: string[] | undefined
  startedAfter: string
  startedBefore?: string
  statusFilter: string[]
  subThemesFilter: number[] | undefined
  targetTypeFilter?: string[] | undefined
  themeFilter: number[] | undefined
  typeFilter?: string | undefined
}

const initialState: ReportingsFiltersSliceType = {
  actionsFilter: [],
  hasFilters: false,
  isAttachedToMissionFilter: false,
  isUnattachedToMissionFilter: false,
  periodFilter: ReportingDateRangeEnum.MONTH,
  seaFrontFilter: undefined,
  searchQueryFilter: undefined,
  sourceFilter: undefined,
  sourceTypeFilter: undefined,
  startedAfter: LAST_30_DAYS,
  startedBefore: undefined,
  statusFilter: [StatusFilterEnum.IN_PROGRESS],
  subThemesFilter: undefined,
  targetTypeFilter: undefined,
  themeFilter: undefined,
  typeFilter: undefined
}

const persistConfig = {
  key: 'reportingFilters',
  storage
}

const reportingFiltersSlice = createSlice({
  initialState,
  name: 'reportingFilters',
  reducers: {
    resetReportingsFilters() {
      return { ...initialState }
    },
    updateFilters(state, action) {
      return {
        ...state,
        [action.payload.key]: action.payload.value,
        hasFilters: !isEqual(
          omit(initialState, ['hasFilters', 'startedAfter', 'startedBefore']),
          omit({ ...state, [action.payload.key]: action.payload.value }, [
            'hasFilters',
            'startedAfter',
            'startedBefore'
          ])
        )
      }
    }
  }
})

export const reportingsFiltersActions = reportingFiltersSlice.actions

export const reportingFiltersPersistedReducer = persistReducer(persistConfig, reportingFiltersSlice.reducer)
