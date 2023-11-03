import { createSlice } from '@reduxjs/toolkit'

import type { Reporting } from '../../../../domain/entities/reporting'

type AttachedReportingToMissionSliceState = {
  attachReportingListener: boolean
  attachedReportingIds: number[]
  attachedReportings: Reporting[]
  initialAttachedReportingIds: number[]
  initialAttachedReportings: Reporting[]
}

const initialState: AttachedReportingToMissionSliceState = {
  attachedReportingIds: [],
  attachedReportings: [],
  attachReportingListener: false,
  initialAttachedReportingIds: [],
  initialAttachedReportings: []
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
    },
    setInitialAttachedReportings(state, action) {
      state.initialAttachedReportingIds = action.payload?.ids
      state.initialAttachedReportings = action.payload.reportings
    }
  }
})

export const attachReportingToMissionSliceActions = attachReportingToMissionSlice.actions

export const attachReportingToMissionsSliceReducer = attachReportingToMissionSlice.reducer
