import { createSlice } from '@reduxjs/toolkit'

import type { Report } from '../entities/report'

type ReportingState = {
  reporting: Report | undefined
}

const initialState: ReportingState = {
  reporting: undefined
}
const reportingStateSlice = createSlice({
  initialState,
  name: 'reportingState',
  reducers: {
    setReporting(state, action) {
      state.reporting = action.payload
    }
  }
})
export const reportingStateActions = reportingStateSlice.actions

export const reportingStateSliceReducer = reportingStateSlice.reducer
