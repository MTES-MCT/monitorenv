import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type AttachMissionToReportingSliceState = {
  attachMissionListener: boolean
  attachedMissionId: number | undefined
  initialAttachedMissionId: number | undefined
}

const initialState: AttachMissionToReportingSliceState = {
  attachedMissionId: undefined,
  attachMissionListener: false,
  initialAttachedMissionId: undefined
}

const attachMissionToReportingSlice = createSlice({
  initialState,
  name: 'attachMissionToReportingSlice',
  reducers: {
    setAttachedMissionId(state, action) {
      state.attachedMissionId = action.payload
    },
    setAttachMissionListener(state, action) {
      state.attachMissionListener = action.payload
    },

    setInitialAttachedMissionId(state, action: PayloadAction<number | undefined>) {
      state.initialAttachedMissionId = action.payload
    }
  }
})

export const attachMissionToReportingSliceActions = attachMissionToReportingSlice.actions

export const attachMissionToReportingSliceReducer = attachMissionToReportingSlice.reducer
