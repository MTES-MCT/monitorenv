import { createSlice } from '@reduxjs/toolkit'

type MissionFiltersSliceType = {
  missionNatureFilter: string[]
  missionStatusFilter: string[]
  missionTypeFilter: string[]
}
const initialState: MissionFiltersSliceType = {
  missionNatureFilter: [],
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
    setMissionStatusFilter(state, action) {
      state.missionStatusFilter = action.payload
    },
    setMissionTypeFilter(state, action) {
      state.missionTypeFilter = action.payload
    }
  }
})

export const { resetMissionFilters, setMissionNatureFilter, setMissionStatusFilter, setMissionTypeFilter } =
  missionFiltersSlice.actions

export const missionFiltersReducer = missionFiltersSlice.reducer
