import { customDayjs } from '@mtes-mct/monitor-ui'
import { createSlice } from '@reduxjs/toolkit'
import { DateRangeEnum } from 'domain/entities/dateRange'
import { StatusFilterEnum } from 'domain/entities/reporting'
import { isEqual, omit } from 'lodash'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import type { TagOption } from 'domain/entities/tags'
import type { ThemeOption } from 'domain/entities/themes'

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
  TAG_FILTER = 'tagFilter',
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
  tagFilter: TagOption[] | undefined
  targetTypeFilter?: string[] | undefined
  themeFilter: ThemeOption[] | undefined
  typeFilter?: string | undefined
}

const initialState: ReportingsFiltersSliceType = {
  actionsFilter: [],
  hasFilters: false,
  isAttachedToMissionFilter: false,
  isUnattachedToMissionFilter: false,
  periodFilter: DateRangeEnum.MONTH,
  seaFrontFilter: undefined,
  searchQueryFilter: undefined,
  sourceFilter: undefined,
  sourceTypeFilter: undefined,
  startedAfter: LAST_30_DAYS,
  startedBefore: undefined,
  statusFilter: [StatusFilterEnum.IN_PROGRESS],
  tagFilter: [],
  targetTypeFilter: undefined,
  themeFilter: [],
  typeFilter: undefined
}

const persistConfig = {
  blacklist: ['searchQueryFilter'],
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
