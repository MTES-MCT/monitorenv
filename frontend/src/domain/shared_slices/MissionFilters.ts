import { createSlice } from '@reduxjs/toolkit'
import dayjs from 'dayjs'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const THIRTY_DAYS_AGO = dayjs().subtract(30, 'days').toISOString()

type MissionFiltersSliceType = {
  missionAdministrationFilter: string | undefined
  missionNatureFilter: string[]
  missionStartedAfter?: string
  missionStartedBefore?: string
  missionStatusFilter: string[]
  missionTypeFilter: string[]
  missionUnitFilter: string | undefined
}

const initialState: MissionFiltersSliceType = {
  missionAdministrationFilter: undefined,
  missionNatureFilter: [],
  missionStartedAfter: THIRTY_DAYS_AGO,
  missionStartedBefore: undefined,
  missionStatusFilter: [],
  missionTypeFilter: [],
  missionUnitFilter: undefined
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
    setMissionAdministrationFilter(state, action) {
      state.missionAdministrationFilter = action.payload
    },
    setMissionNatureFilter(state, action) {
      state.missionNatureFilter = action.payload
    },
    setMissionStartedAfter(state, action) {
      state.missionStartedAfter = action.payload
    },
    setMissionStartedBefore(state, action) {
      state.missionStartedBefore = action.payload
    },
    setMissionStatusFilter(state, action) {
      state.missionStatusFilter = action.payload
    },
    setMissionTypeFilter(state, action) {
      state.missionTypeFilter = action.payload
    },
    setMissionUnitFilter(state, action) {
      state.missionUnitFilter = action.payload
    }
  }
})

export const {
  resetMissionFilters,
  setMissionAdministrationFilter,
  setMissionNatureFilter,
  setMissionStartedAfter,
  setMissionStartedBefore,
  setMissionStatusFilter,
  setMissionTypeFilter,
  setMissionUnitFilter
} = missionFiltersSlice.actions

export const missionFiltersPersistedReducer = persistReducer(persistConfig, missionFiltersSlice.reducer)
