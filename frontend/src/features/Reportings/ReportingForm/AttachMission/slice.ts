import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type { Mission } from '../../../../domain/entities/missions'

type AttachMissionToReportingSliceState = {
  attachMissionListener: boolean
  attachedMission: Mission | undefined
  attachedMissionId: number | undefined
  initialAttachedMission: Mission | undefined
  initialAttachedMissionId: number | undefined
}

const initialState: AttachMissionToReportingSliceState = {
  attachedMission: undefined,
  attachedMissionId: undefined,
  attachMissionListener: false,
  initialAttachedMission: undefined,
  initialAttachedMissionId: undefined
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
    setAttachedMissionId(state, action) {
      state.attachedMissionId = action.payload
    },
    setAttachMissionListener(state, action) {
      state.attachMissionListener = action.payload
    },
    setInitialAttachedMission(state, action: PayloadAction<Mission | undefined>) {
      state.initialAttachedMissionId = action.payload?.id
      state.initialAttachedMission = action.payload
    }
  }
})

export const attachMissionToReportingSliceActions = attachMissionToReportingSlice.actions

export const attachMissionToReportingSliceReducer = attachMissionToReportingSlice.reducer
