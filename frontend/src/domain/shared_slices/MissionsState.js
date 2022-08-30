import { createSlice } from '@reduxjs/toolkit'

/* eslint-disable */
/** @namespace MissionStateReducer */
const MissionStateReducer = null
/* eslint-enable */

const missionStateSlice = createSlice({
  name: 'missionState',
  initialState: {
    // selectedMissionId on Map
    selectedMissionId: null,
    // state of the mission being edited (synced with form)
    missionState: null
  },
  reducers: {
    setSelectedMissionId (state, action) {
      state.selectedMissionId = action.payload
    },
    resetSelectedMission (state) {
      state.selectedMissionId = null
    },
    setMissionState (state, action) {
      state.missionState = action.payload
    }
  }
})

export const {
  setSelectedMissionId,
  resetSelectedMission,
  setMissionState
} = missionStateSlice.actions

export default missionStateSlice.reducer
