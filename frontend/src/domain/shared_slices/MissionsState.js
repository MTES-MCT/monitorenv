import { createSlice } from '@reduxjs/toolkit'

/* eslint-disable */
/** @namespace MissionStateReducer */
const MissionStateReducer = null
/* eslint-enable */

const missionStateSlice = createSlice({
  initialState: {
    // state of the mission being edited (synced with form)
    missionState: null,

    // selectedMissionId on Map
    selectedMissionId: null
  },
  name: 'missionState',
  reducers: {
    resetSelectedMission(state) {
      state.selectedMissionId = null
    },
    setMissionState(state, action) {
      state.missionState = action.payload
    },
    setSelectedMissionId(state, action) {
      state.selectedMissionId = action.payload
    }
  }
})

export const { resetSelectedMission, setMissionState, setSelectedMissionId } = missionStateSlice.actions

export default missionStateSlice.reducer
