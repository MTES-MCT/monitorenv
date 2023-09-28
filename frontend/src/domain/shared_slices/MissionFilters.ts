import { customDayjs as dayjs } from '@mtes-mct/monitor-ui'
import { createSlice } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import { dateRangeLabels } from '../entities/dateRange'

export const SEVEN_DAYS_AGO = dayjs().subtract(7, 'days').toISOString()

export enum MissionFiltersEnum {
  ADMINISTRATION_FILTER = 'selectedAdministrationNames',
  PERIOD_FILTER = 'selectedPeriodFilter',
  SEA_FRONT_FILTER = 'selectedSeaFronts',
  SOURCE_FILTER = 'selectedMissionSource',
  STARTED_AFTER_FILTER = 'startedAfter',
  STARTED_BEFORE_FILTER = 'startedBefore',
  STATUS_FILTER = 'selectedStatuses',
  THEME_FILTER = 'selectedThemes',
  TYPE_FILTER = 'selectedMissionTypes',
  UNIT_FILTER = 'selectedControlUnitIds'
}

type MissionFiltersSliceType = {
  hasFilters: boolean
  selectedAdministrationNames: string[]
  selectedControlUnitIds: number[]
  selectedMissionSource: string | undefined
  selectedMissionTypes: string[]
  selectedPeriod: string
  selectedSeaFronts: string[]
  selectedStatuses: string[]
  selectedThemes: string[]
  startedAfter?: string
  startedBefore?: string
}

const initialState: MissionFiltersSliceType = {
  hasFilters: false,
  selectedAdministrationNames: [],
  selectedControlUnitIds: [],
  selectedMissionSource: undefined,
  selectedMissionTypes: [],
  selectedPeriod: dateRangeLabels.WEEK.value,
  selectedSeaFronts: [],
  selectedStatuses: [],
  selectedThemes: [],
  startedAfter: SEVEN_DAYS_AGO,
  startedBefore: undefined
}

const persistConfig = {
  key: 'missionFilters',
  storage
}

const missionFiltersSlice = createSlice({
  initialState,
  name: 'missionFilters',
  reducers: {
    resetMissionFilters() {
      return { ...initialState }
    },

    updateFilters(state, action) {
      return {
        ...state,
        [action.payload.key]: action.payload.value,
        hasFilters:
          (action.payload.value && action.payload.value.length > 0) ||
          state.selectedPeriod !== dateRangeLabels.WEEK.value ||
          state.selectedAdministrationNames.length > 0 ||
          state.selectedControlUnitIds.length > 0 ||
          state.selectedMissionTypes.length > 0 ||
          state.selectedSeaFronts.length > 0 ||
          state.selectedStatuses.length > 0 ||
          state.selectedThemes.length > 0
      }
    }
  }
})

export const { resetMissionFilters, updateFilters } = missionFiltersSlice.actions

export const missionFiltersPersistedReducer = persistReducer(persistConfig, missionFiltersSlice.reducer)
