import { createSlice } from '@reduxjs/toolkit'

import type { Reporting } from '../../../../domain/entities/reporting'

type AttachedReportingToMissionSliceState = {
  attachReportingListener: boolean
  attachedReportingIds: number[]
  attachedReportings: Reporting[]
}

const initialState: AttachedReportingToMissionSliceState = {
  attachedReportingIds: [],
  attachedReportings: [],
  attachReportingListener: false
}

const attachReportingToMissionSlice = createSlice({
  initialState,
  name: 'attachReportingToMissionSlice',
  reducers: {
    addAttachedReportingId(state, action) {
      state.attachedReportingIds = [...state.attachedReportingIds, action.payload]
    },
    resetAttachReportingState() {
      return initialState
    },
    setAttachedReportingIds(state, action) {
      state.attachedReportingIds = action.payload
    },
    setAttachedReportings(state, action) {
      state.attachedReportings = action.payload
    },
    setAttachReportingListener(state, action) {
      state.attachReportingListener = action.payload
    }
  }
})

export const attachReportingToMissionSliceActions = attachReportingToMissionSlice.actions

export const attachReportingToMissionsSliceReducer = attachReportingToMissionSlice.reducer
