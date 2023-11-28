import { createSlice } from '@reduxjs/toolkit'

import type { Reporting, ReportingDetailed } from '../../domain/entities/reporting'

type AttachedReportingToMissionSliceState = {
  attachedReportingIds: number[]
  attachedReportings: ReportingDetailed[]
  initialAttachedReportingIds: number[]
  initialAttachedReportings: Reporting[]
  isReportingAttachmentInProgress: boolean
}

const INITIAL_STATE: AttachedReportingToMissionSliceState = {
  attachedReportingIds: [],
  attachedReportings: [],
  initialAttachedReportingIds: [],
  initialAttachedReportings: [],
  isReportingAttachmentInProgress: false
}

const attachReportingToMissionSlice = createSlice({
  initialState: INITIAL_STATE,
  name: 'attachReportingToMissionSlice',
  reducers: {
    addAttachedReportingId(state, action) {
      state.attachedReportingIds = [...state.attachedReportingIds, action.payload]
    },
    resetAttachReportingState() {
      return INITIAL_STATE
    },
    setAttachedReportings(state, action) {
      const attachedReportings = action.payload
      state.attachedReportings = attachedReportings

      const attachedReportingIds = attachedReportings.map(reporting => reporting.id)
      state.attachedReportingIds = attachedReportingIds
    },
    setInitialAttachedReportings(state, action) {
      state.initialAttachedReportingIds = action.payload?.ids
      state.initialAttachedReportings = action.payload.reportings
    },
    setIsReportingAttachmentInProgress(state, action) {
      state.isReportingAttachmentInProgress = action.payload
    }
  }
})

export const attachReportingToMissionSliceActions = attachReportingToMissionSlice.actions

export const attachReportingToMissionsSliceReducer = attachReportingToMissionSlice.reducer
