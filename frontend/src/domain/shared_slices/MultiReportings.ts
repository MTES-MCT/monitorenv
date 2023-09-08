import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import type { ReportingContext } from './ReportingState'
import type { Reporting } from '../entities/reporting'

export type SelectedReporting = {
  context: ReportingContext
  isFormDirty: boolean
  reporting: Partial<Reporting>
}
type MultiReportingsState = {
  activeReportingId: number | string | undefined
  selectedReportingId?: number | string | undefined
  selectedReportingIdOnMap?: number | string | undefined
  selectedReportings: SelectedReporting[]
}

const initialState: MultiReportingsState = {
  activeReportingId: undefined,
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
    setActiveReportingId(state, action: PayloadAction<number | string | undefined>) {
      state.activeReportingId = action.payload
    },
    setIsDirty(state, action: PayloadAction<number | string>) {
      const index = state.selectedReportings.findIndex(reporting => reporting.reporting.id === action.payload)

      if (index !== -1) {
        const report = state.selectedReportings[index]
        if (report) {
          report.isFormDirty = true
        }
      }
    },
    setReporting(state, action: PayloadAction<SelectedReporting>) {
      const index = state.selectedReportings.findIndex(
        reporting => reporting.reporting.id === action.payload.reporting?.id
      )
      if (index === -1) {
        state.selectedReportings.push(action.payload)
      } else {
        state.selectedReportings[index] = action.payload
      }
    },
    setReportingState(state, action: PayloadAction<Partial<Reporting>>) {
      const index = state.selectedReportings.findIndex(reporting => reporting?.reporting?.id === action.payload?.id)

      if (index !== -1) {
        const report = state.selectedReportings[index]
        if (report) {
          report.reporting = action.payload
        }
      }
    },
    setSelectedReportingId(state, action: PayloadAction<number | string | undefined>) {
      state.selectedReportingId = action.payload
    },
    setSelectedReportingIdOnMap(state, action: PayloadAction<number | undefined>) {
      state.selectedReportingIdOnMap = action.payload
    },
    setSelectedReportings(state, action) {
      state.selectedReportings = action.payload.selectedReportings
      state.activeReportingId = action.payload.activeReportingId
    }
  }
})
export const multiReportingsActions = multiReportingsSlice.actions

export const multiReportingsSliceReducer = multiReportingsSlice.reducer
