import { customDayjs } from '@mtes-mct/monitor-ui'
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { missionFiltersMigrations } from '@store/migrations/missionsFilters'
import { isEqual } from 'lodash'
import { createMigrate, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import { DateRangeEnum, DAY_OPTION } from '../entities/dateRange'

import type { TagOption } from 'domain/entities/tags'

export const TODAY = customDayjs().utc().startOf('day').toISOString()

export enum MissionFiltersEnum {
  ADMINISTRATION_FILTER = 'selectedAdministrationNames',
  COMPLETION_STATUS_FILTER = 'selectedCompletionStatus',
  PERIOD_FILTER = 'selectedPeriod',
  SEARCH_QUERY_FILTER = 'searchQuery',
  SEA_FRONT_FILTER = 'selectedSeaFronts',
  STARTED_AFTER_FILTER = 'startedAfter',
  STARTED_BEFORE_FILTER = 'startedBefore',
  STATUS_FILTER = 'selectedStatuses',
  TAGS_FILTER = 'selectedTags',
  THEME_FILTER = 'selectedThemes',
  TYPE_FILTER = 'selectedMissionTypes',
  UNIT_FILTER = 'selectedControlUnitIds',
  WITH_ENV_ACTIONS_FILTER = 'selectedWithEnvActions'
}

type MissionFilterValues = {
  nbOfFilters: boolean
  searchQuery: string | undefined
  selectedAdministrationNames: string[] | undefined
  selectedCompletionStatus: string[] | undefined
  selectedControlUnitIds: number[] | undefined
  selectedMissionTypes: string[] | undefined
  selectedPeriod: DateRangeEnum
  selectedSeaFronts: string[] | undefined
  selectedStatuses: string[] | undefined
  selectedTags: TagOption[] | undefined
  selectedThemes: number[] | undefined
  selectedWithEnvActions: boolean
  startedAfter?: string
  startedBefore?: string
}

export type MissionFiltersState = {
  [K in MissionFiltersEnum]: MissionFilterValues[K]
} & {
  nbOfFiltersSetted: number
}

export const INITIAL_STATE: MissionFiltersState = {
  nbOfFiltersSetted: 0,
  searchQuery: undefined,
  selectedAdministrationNames: undefined,
  selectedCompletionStatus: undefined,
  selectedControlUnitIds: undefined,
  selectedMissionTypes: undefined,
  selectedPeriod: DAY_OPTION.value,
  selectedSeaFronts: undefined,
  selectedStatuses: undefined,
  selectedTags: undefined,
  selectedThemes: undefined,
  selectedWithEnvActions: false,
  startedAfter: TODAY,
  startedBefore: undefined
}
const migrations = {
  2: (state: any) => missionFiltersMigrations.v2(state)
}

const persistConfig = {
  blacklist: ['searchQuery'],
  key: 'missionFilters',
  migrate: createMigrate(migrations),
  storage,
  version: 2
}

const missionFiltersSlice = createSlice({
  initialState: INITIAL_STATE,
  name: 'missionFilters',
  reducers: {
    resetMissionFilters() {
      return { ...INITIAL_STATE }
    },

    updateFilters<K extends MissionFiltersEnum>(
      // TODO There is not `MissionFiltersState` type inference in `createSlice()`.
      // Investigate why (this should be automatic).
      state: MissionFiltersState,
      action: PayloadAction<{
        key: K
        value: MissionFiltersState[K]
      }>
    ) {
      const nextState: MissionFiltersState = {
        ...state,
        [action.payload.key]: action.payload.value
      }

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

export const { resetMissionFilters, updateFilters } = missionFiltersSlice.actions

export const missionFiltersPersistedReducer = persistReducer(persistConfig, missionFiltersSlice.reducer)
