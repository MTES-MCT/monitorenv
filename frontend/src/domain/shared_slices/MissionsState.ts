import { createSlice } from '@reduxjs/toolkit'

import type { Mission } from '../entities/missions'

type MissionStateSliceType = {
  missionState: Partial<Mission> | undefined
  selectedMissionId: number | undefined
}
const initialState: MissionStateSliceType = {
  // state of the mission being edited (synced with form)
  missionState: undefined,

  // selectedMissionId on Map
  selectedMissionId: undefined
}
const missionStateSlice = createSlice({
  initialState,
  name: 'missionState',
  reducers: {
    resetSelectedMission(state) {
      state.selectedMissionId = undefined
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

export const missionStateSliceReducer = missionStateSlice.reducer
