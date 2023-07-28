import { createSlice } from '@reduxjs/toolkit'

import type { Reporting } from '../entities/reporting'

export enum ReportingFormVisibility {
  NOT_VISIBLE = 'not_visible',
  REDUCE = 'reduce',
  VISIBLE = 'visible'
}

type ReportingState = {
  reporting: Reporting | undefined
  selectedReportingId: number | undefined
}

const initialState: ReportingState = {
  reporting: undefined,
  selectedReportingId: undefined
}
const reportingStateSlice = createSlice({
  initialState,
  name: 'reportingState',
  reducers: {
    setReporting(state, action) {
      state.reporting = action.payload
    },
    setSelectedReportingId(state, action) {
      state.selectedReportingId = action.payload
    }
  }
})
export const reportingStateActions = reportingStateSlice.actions

export const reportingStateSliceReducer = reportingStateSlice.reducer
