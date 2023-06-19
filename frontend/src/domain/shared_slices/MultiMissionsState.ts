import { createSlice } from '@reduxjs/toolkit'

import type { Mission } from '../entities/missions'

type SelectedMission = {
  id: number
  type: string
}

type MultiMissionsStateSliceType = {
  multiMissionsState: Partial<Mission>[]
  selectedMissionsIds: SelectedMission[]
}
const initialState: MultiMissionsStateSliceType = {
  multiMissionsState: [],
  selectedMissionsIds: []
}
const multiMissionsStateSlice = createSlice({
  initialState,
  name: 'multiMissionsState',
  reducers: {
    deleteSelectedMissionId(state, action) {
      state.selectedMissionsIds = [...state.selectedMissionsIds].filter(
        selectedMission => action.payload !== selectedMission.id
      )
    },
    setMultiMissionsState(state, action) {
      state.multiMissionsState = action.payload
    },
    setSelectedMissionsIds(state, action) {
      if (!state.selectedMissionsIds.find(selectedId => selectedId.id === action.payload.id)) {
        state.selectedMissionsIds = [...state.selectedMissionsIds, action.payload]
      }
    }
  }
})

export const { deleteSelectedMissionId, setMultiMissionsState, setSelectedMissionsIds } =
  multiMissionsStateSlice.actions

export const multiMissionsStateSliceReducer = multiMissionsStateSlice.reducer
