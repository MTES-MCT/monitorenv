import { customDayjs } from '@mtes-mct/monitor-ui'
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { reportingsFiltersMigrations } from '@store/migrations/reportingsFilters'
import { DateRangeEnum } from 'domain/entities/dateRange'
import { StatusFilterEnum } from 'domain/entities/reporting'
import { isEqual } from 'lodash'
import { createMigrate, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import type { TagOption } from 'domain/entities/tags'
import type { ThemeOption } from 'domain/entities/themes'

export const LAST_30_DAYS = customDayjs.utc().subtract(30, 'day').toISOString()

const migrations = {
  2: (state: any) => reportingsFiltersMigrations.v2(state)
}

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
  isAttachedToMissionFilter?: boolean
  isUnattachedToMissionFilter?: boolean
  nbOfFiltersSetted: number
  periodFilter: string
  seaFrontFilter: string[] | undefined
  searchQueryFilter: string | undefined
  sourceFilter: SourceFilterProps[] | undefined
  sourceTypeFilter: string[] | undefined
  startedAfter: string | undefined
  startedBefore?: string
  statusFilter: string[]
  tagFilter: TagOption[] | undefined
  targetTypeFilter?: string[] | undefined
  themeFilter: ThemeOption[] | undefined
  typeFilter?: string | undefined
}

export const INITIAL_STATE: ReportingsFiltersSliceType = {
  actionsFilter: [],
  isAttachedToMissionFilter: false,
  isUnattachedToMissionFilter: false,
  nbOfFiltersSetted: 0,
  periodFilter: DateRangeEnum.MONTH,
  seaFrontFilter: undefined,
  searchQueryFilter: undefined,
  sourceFilter: undefined,
  sourceTypeFilter: undefined,
  startedAfter: LAST_30_DAYS,
  startedBefore: undefined,
  statusFilter: [StatusFilterEnum.IN_PROGRESS],
  tagFilter: undefined,
  targetTypeFilter: undefined,
  themeFilter: undefined,
  typeFilter: undefined
}

const persistConfig = {
  blacklist: ['searchQueryFilter'],
  key: 'reportingFilters',
  migrate: createMigrate(migrations),
  storage,
  version: 2
}

const reportingFiltersSlice = createSlice({
  initialState: INITIAL_STATE,
  name: 'reportingFilters',
  reducers: {
    resetReportingsFilters() {
      return { ...INITIAL_STATE }
    },
    updateFilters<K extends keyof ReportingsFiltersSliceType>(
      state: ReportingsFiltersSliceType,
      action: PayloadAction<{
        key: K
        value: ReportingsFiltersSliceType[keyof ReportingsFiltersSliceType]
      }>
    ) {
      const nextState = { ...state, [action.payload.key]: action.payload.value }

      const keysToExclude = ['startedAfter', 'startedBefore', 'nbOfFiltersSetted']

      const keysToCheck = Object.keys(INITIAL_STATE).filter(key => !keysToExclude.includes(key))

      const nbOfFiltersSetted = keysToCheck.reduce(
        (count, key) => (isEqual(nextState[key], INITIAL_STATE[key]) ? count : count + 1),
        0
      )

      return {
        ...nextState,
        nbOfFiltersSetted
      }
    }
  }
})

export const reportingsFiltersActions = reportingFiltersSlice.actions

export const reportingFiltersPersistedReducer = persistReducer(persistConfig, reportingFiltersSlice.reducer)
