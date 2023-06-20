import { createSlice } from '@reduxjs/toolkit'

import type { Mission } from '../entities/missions'

type SelectedMission = {
  mission: Partial<Mission>
  type: 'new' | 'edit'
}
type MultiMissionsStateSliceType = {
  multiMissionsState: SelectedMission[]
}

const initialState: MultiMissionsStateSliceType = {
  multiMissionsState: []
}
const multiMissionsStateSlice = createSlice({
  initialState,
  name: 'multiMissionsState',
  reducers: {
    deleteMissionFromMultiMissionState(state, action) {
      state.multiMissionsState = [...state.multiMissionsState].filter(mission => action.payload !== mission.mission.id)
    },
    setMultiMissionsState(state, action) {
      state.multiMissionsState = action.payload
    }
  }
})

export const { deleteMissionFromMultiMissionState, setMultiMissionsState } = multiMissionsStateSlice.actions

export const multiMissionsStateSliceReducer = multiMissionsStateSlice.reducer
