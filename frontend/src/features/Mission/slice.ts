import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

type MissionSliceType = {
  selectedMissionIdOnMap: number | string | undefined
}

const INITIAL_STATE: MissionSliceType = {
  selectedMissionIdOnMap: undefined
}

const missionSlice = createSlice({
  initialState: INITIAL_STATE,
  name: 'mission',
  reducers: {
    resetSelectedMissionIdOnMap() {
      return INITIAL_STATE
    },
    setSelectedMissionIdOnMap(state, action: PayloadAction<number | string>) {
      state.selectedMissionIdOnMap = action.payload
    }
  }
})
export const missionActions = missionSlice.actions

export const missionSliceReducer = missionSlice.reducer
