import { createSlice } from '@reduxjs/toolkit'

import type { Mission } from '../entities/missions'

type MissionStateSliceType = {
  isFormDirty: boolean
  missionState: Partial<Mission> | undefined
  selectedMissionId: number | undefined
}
const initialState: MissionStateSliceType = {
  isFormDirty: false,

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
      return {
        ...state,
        selectedMissionId: undefined
      }
    },
    setIsFormDirty(state, action) {
      return {
        ...state,
        isFormDirty: action.payload
      }
    },
    setMissionState(state, action) {
      return {
        ...state,
        missionState: action.payload
      }
    },
    setSelectedMissionId(state, action) {
      return {
        ...state,
        selectedMissionId: action.payload
      }
    }
  }
})

export const { resetSelectedMission, setIsFormDirty, setMissionState, setSelectedMissionId } = missionStateSlice.actions

export const missionStateSliceReducer = missionStateSlice.reducer
