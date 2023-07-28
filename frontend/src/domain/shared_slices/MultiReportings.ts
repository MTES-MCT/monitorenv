import { createSlice } from '@reduxjs/toolkit'

import type { Reporting } from '../entities/reporting'

type SelectedReporting = {
  isFormDirty: boolean
  reporting: Partial<Reporting>
}
type MultiReportingsState = {
  nextSelectedReporting: Partial<Reporting> | undefined
  selectedReportings: SelectedReporting[]
}

const initialState: MultiReportingsState = {
  nextSelectedReporting: undefined,
  selectedReportings: []
}
const multiReportingsSlice = createSlice({
  initialState,
  name: 'multiReportings',
  reducers: {
    deleteSelectedReporting(state, action) {
      state.selectedReportings = [...state.selectedReportings].filter(
        reporting => action.payload !== reporting.reporting.id
      )
    },
    setNextSelectedReporting(state, action) {
      state.nextSelectedReporting = action.payload
    },
    setSelectedReportings(state, action) {
      state.selectedReportings = action.payload
    }
  }
})
export const multiReportingsActions = multiReportingsSlice.actions

export const multiReportingsSliceReducer = multiReportingsSlice.reducer
