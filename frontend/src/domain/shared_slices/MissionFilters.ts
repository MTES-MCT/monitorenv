import { createSlice } from '@reduxjs/toolkit'
import dayjs from 'dayjs'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const THIRTY_DAYS_AGO = dayjs().subtract(30, 'days').toISOString()

type MissionFiltersSliceType = {
  administrationFilter: string | undefined
  sourceFilter: string[]
  startedAfter?: string
  startedBefore?: string
  statusFilter: string[]
  typeFilter: string[]
  unitFilter: string | undefined
}

const initialState: MissionFiltersSliceType = {
  administrationFilter: undefined,
  sourceFilter: [],
  startedAfter: THIRTY_DAYS_AGO,
  startedBefore: undefined,
  statusFilter: [],
  typeFilter: [],
  unitFilter: undefined
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
        [action.payload.key]: action.payload.value
      }
    }
  }
})

export const { resetMissionFilters, updateFilters } = missionFiltersSlice.actions

export const missionFiltersPersistedReducer = persistReducer(persistConfig, missionFiltersSlice.reducer)
