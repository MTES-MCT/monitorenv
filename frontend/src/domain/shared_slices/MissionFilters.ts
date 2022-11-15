import { createSlice } from '@reduxjs/toolkit'

type MissionFiltersSliceType = {
  missionNatureFilter: string[]
  missionStartedAfter: Date | null
  missionStartedBefore: Date | null
  missionStatusFilter: string[]
  missionTypeFilter: string[]
}
const initialState: MissionFiltersSliceType = {
  missionNatureFilter: [],
  missionStartedAfter: null,
  missionStartedBefore: null,
  missionStatusFilter: [],
  missionTypeFilter: []
}
const missionFiltersSlice = createSlice({
  initialState,
  name: 'missionFilters',
  reducers: {
    resetMissionFilters() {
      return { ...initialState }
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
    }
  }
})

export const {
  resetMissionFilters,
  setMissionNatureFilter,
  setMissionStartedAfter,
  setMissionStartedBefore,
  setMissionStatusFilter,
  setMissionTypeFilter
} = missionFiltersSlice.actions

export const missionFiltersReducer = missionFiltersSlice.reducer
