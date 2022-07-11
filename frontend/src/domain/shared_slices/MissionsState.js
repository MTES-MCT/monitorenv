import { createSlice } from '@reduxjs/toolkit'

/* eslint-disable */
/** @namespace MissionStateReducer */
const MissionStateReducer = null
/* eslint-enable */

const missionStateSlice = createSlice({
  name: 'missionState',
  initialState: {
    selectedMissionId: null,
  },
  reducers: {
    setSelectedMissionId (state, action) {
      state.selectedMissionId = action.payload
    },
  }
})

export const {
  setSelectedMissionId
} = missionStateSlice.actions

export default missionStateSlice.reducer
