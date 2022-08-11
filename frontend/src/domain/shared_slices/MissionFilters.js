import { createSlice } from '@reduxjs/toolkit'

/* eslint-disable */
/** @namespace MissionFiltersReducer */
const MissionFiltersReducer = null
/* eslint-enable */

const initialState = {
  missionStatusFilter: [],
  missionNatureFilter: [],
  missionTypeFilter: []
}
const missionFiltersSlice = createSlice({
  name: 'missionFilters',
  initialState: {...initialState},
  reducers: {
    setMissionStatusFilter (state, action) {
      state.missionStatusFilter = action.payload
    },
    setMissionNatureFilter (state, action) {
      state.missionNatureFilter = action.payload
    },
    setMissionTypeFilter (state, action) {
      state.missionTypeFilter = action.payload
    },
    resetMissionFilters () {
      return {...initialState}
    }
  }
})

export const {
  setMissionStatusFilter,
  setMissionNatureFilter,
  setMissionTypeFilter,
  resetMissionFilters
} = missionFiltersSlice.actions

export const missionFiltersReducer = missionFiltersSlice.reducer
