import { createSlice } from '@reduxjs/toolkit'

/* eslint-disable */
/** @namespace MissionStateReducer */
const MissionStateReducer = null
/* eslint-enable */

const missionStateSlice = createSlice({
  name: 'missionState',
  initialState: {
    selectedMissionId: null,
    missionIdBeingEdited: null,
    missionBeingEdited: null,
  },
  reducers: {
    setSelectedMissionId (state, action) {
      state.selectedMissionId = action.payload
    },
    setMissionIdBeingEdited (state, action) {
      state.missionIdBeingEdited = action.payload
    },
    setMissionBeingEdited (state, action) {
      state.missionBeingEdited = action.payload
    },
  }
})

export const {
  setSelectedMissionId,
  setMissionIdBeingEdited,
  setMissionBeingEdited
} = missionStateSlice.actions

export default missionStateSlice.reducer
