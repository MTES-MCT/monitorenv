import { createSlice } from '@reduxjs/toolkit'

import type { Reporting } from '../entities/reporting'

export enum ReportingFormVisibility {
  NOT_VISIBLE = 'not_visible',
  REDUCE = 'reduce',
  VISIBLE = 'visible',
  VISIBLE_LEFT = 'visible_left'
}

type ReportingState = {
  reportingState: Reporting | undefined
  selectedReportingId: number | undefined
  selectedReportingIdOnMap: number | undefined
}

const initialState: ReportingState = {
  reportingState: undefined,
  selectedReportingId: undefined,
  selectedReportingIdOnMap: undefined
}
const reportingStateSlice = createSlice({
  initialState,
  name: 'reportingState',
  reducers: {
    setReportingState(state, action) {
      state.reportingState = action.payload
    },
    setSelectedReportingId(state, action) {
      state.selectedReportingId = action.payload
    },
    setSelectedReportingIdOnMap(state, action) {
      state.selectedReportingIdOnMap = action.payload
    }
  }
})
export const reportingStateActions = reportingStateSlice.actions

export const reportingStateSliceReducer = reportingStateSlice.reducer
