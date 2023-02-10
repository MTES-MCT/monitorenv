import { createSlice } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

type MissionFiltersSliceType = {
  missionAdministrationFilter: string | null
  missionNatureFilter: string[]
  missionStartedAfter: string | null
  missionStartedBefore: string | null
  missionStatusFilter: string[]
  missionTypeFilter: string[]
  missionUnitFilter: string | null
}

const initialState: MissionFiltersSliceType = {
  missionAdministrationFilter: null,
  missionNatureFilter: [],
  missionStartedAfter: null,
  missionStartedBefore: null,
  missionStatusFilter: [],
  missionTypeFilter: [],
  missionUnitFilter: null
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
