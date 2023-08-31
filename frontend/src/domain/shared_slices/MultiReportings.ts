import { createSlice } from '@reduxjs/toolkit'

import type { ReportingContext } from './ReportingState'
import type { Reporting } from '../entities/reporting'

export type SelectedReporting = {
  context: ReportingContext
  isFormDirty: boolean
  reporting: Partial<Reporting>
}
type MultiReportingsState = {
  activeReportingId: number | string | undefined
  nextSelectedReporting: Partial<Reporting> | undefined
  selectedReportings: SelectedReporting[]
}

const initialState: MultiReportingsState = {
  activeReportingId: undefined,
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
      state.activeReportingId = undefined
    },
    setNextSelectedReporting(state, action) {
      state.nextSelectedReporting = action.payload
    },
    setSelectedReportings(state, action) {
      state.selectedReportings = action.payload.selectedReportings
      state.activeReportingId = action.payload.activeReportingId
    }
  }
})
export const multiReportingsActions = multiReportingsSlice.actions

export const multiReportingsSliceReducer = multiReportingsSlice.reducer
