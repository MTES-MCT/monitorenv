import { createSlice } from '@reduxjs/toolkit'

import type { Reporting, ReportingDetailed } from '../../../../domain/entities/reporting'

type AttachedReportingToMissionSliceState = {
  attachReportingListener: boolean
  attachedReportingIds: number[]
  attachedReportings: ReportingDetailed[]
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
    setAttachedReportings(state, action) {
      const attachedReportings = action.payload
      state.attachedReportings = attachedReportings

      const attachedReportingIds = attachedReportings.map(reporting => reporting.id)
      state.attachedReportingIds = attachedReportingIds
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
