import { Mission } from '@features/Mission/mission.type'
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

type AttachMissionToReportingSliceState = {
  attachedMission: Mission.Mission | undefined
  initialAttachedMission: Mission.Mission | undefined
  initialMissionId: number | undefined
  isMissionAttachmentInProgress: boolean
  missionId: number | undefined
}

const INITIAL_STATE: AttachMissionToReportingSliceState = {
  attachedMission: undefined,
  initialAttachedMission: undefined,
  initialMissionId: undefined,
  isMissionAttachmentInProgress: false,
  missionId: undefined
}

const attachMissionToReportingSlice = createSlice({
  initialState: INITIAL_STATE,
  name: 'attachMissionToReportingSlice',
  reducers: {
    resetAttachMissionState() {
      return INITIAL_STATE
    },
    setAttachedMission(state, action) {
      state.attachedMission = action.payload
      state.missionId = action.payload?.id
    },
    setInitialAttachedMission(state, action: PayloadAction<Mission.Mission | undefined>) {
      state.initialMissionId = action.payload?.id
      state.initialAttachedMission = action.payload
    },
    setIsMissionAttachmentInProgress(state, action) {
      state.isMissionAttachmentInProgress = action.payload
    }
  }
})

export const attachMissionToReportingSliceActions = attachMissionToReportingSlice.actions

export const attachMissionToReportingSliceReducer = attachMissionToReportingSlice.reducer
