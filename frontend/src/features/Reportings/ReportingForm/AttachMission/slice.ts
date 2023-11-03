import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type { Mission } from '../../../../domain/entities/missions'

type AttachMissionToReportingSliceState = {
  attachMissionListener: boolean
  attachedMission: Mission | undefined
  initialAttachedMission: Mission | undefined
  initialMissionId: number | undefined
  missionId: number | undefined
}

const initialState: AttachMissionToReportingSliceState = {
  attachedMission: undefined,
  attachMissionListener: false,
  initialAttachedMission: undefined,
  initialMissionId: undefined,
  missionId: undefined
}

const attachMissionToReportingSlice = createSlice({
  initialState,
  name: 'attachMissionToReportingSlice',
  reducers: {
    resetAttachMissionState() {
      return initialState
    },
    setAttachedMission(state, action) {
      state.attachedMission = action.payload
    },
    setAttachMissionListener(state, action) {
      state.attachMissionListener = action.payload
    },
    setInitialAttachedMission(state, action: PayloadAction<Mission | undefined>) {
      state.initialMissionId = action.payload?.id
      state.initialAttachedMission = action.payload
    },
    setMissionId(state, action) {
      state.missionId = action.payload
    }
  }
})

export const attachMissionToReportingSliceActions = attachMissionToReportingSlice.actions

export const attachMissionToReportingSliceReducer = attachMissionToReportingSlice.reducer
