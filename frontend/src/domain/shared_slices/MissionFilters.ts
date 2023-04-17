import { createSlice } from '@reduxjs/toolkit'
import dayjs from 'dayjs'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import { dateRangeEnum } from '../entities/missions'

export const SEVEN_DAYS_AGO = dayjs().subtract(7, 'days').toISOString()

type MissionFiltersSliceType = {
  administrationFilter: string[]
  hasNoFilter: boolean
  periodFilter: string
  seaFrontFilter: string[]
  sourceFilter: string | undefined
  startedAfter?: string
  startedBefore?: string
  statusFilter: string[]
  typeFilter: string[]
  unitFilter: string[]
}

const initialState: MissionFiltersSliceType = {
  administrationFilter: [],
  hasNoFilter: true,
  periodFilter: dateRangeEnum.WEEK.value,
  seaFrontFilter: [],
  sourceFilter: undefined,
  startedAfter: SEVEN_DAYS_AGO,
  startedBefore: undefined,
  statusFilter: [],
  typeFilter: [],
  unitFilter: []
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
        // TODO update condition when unit and administrations were array
        hasNoFilter: !state.administrationFilter && !state.sourceFilter
      }
    }
  }
})

export const { resetMissionFilters, updateFilters } = missionFiltersSlice.actions

export const missionFiltersPersistedReducer = persistReducer(persistConfig, missionFiltersSlice.reducer)
