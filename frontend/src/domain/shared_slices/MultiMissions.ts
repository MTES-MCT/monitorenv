import { createSlice } from '@reduxjs/toolkit'

import type { Mission } from '../entities/missions'

type SelectedMission = {
  isFormDirty: boolean
  mission: Partial<Mission>
  type: 'new' | 'edit'
}
type MultiMissionsState = {
  selectedMissions: SelectedMission[]
}

const initialState: MultiMissionsState = {
  selectedMissions: []
}
const multiMissionsSlice = createSlice({
  initialState,
  name: 'multiMissions',
  reducers: {
    deleteSelectedMission(state, action) {
      state.selectedMissions = [...state.selectedMissions].filter(mission => action.payload !== mission.mission.id)
    },
    setSelectedMissions(state, action) {
      state.selectedMissions = action.payload
    }
  }
})
export const multiMissionsActions = multiMissionsSlice.actions

export const multiMissionsSliceReducer = multiMissionsSlice.reducer
