import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import type { ReportingContext } from './Global'
import type { AtLeast } from '../../types'
import type { Reporting } from '../entities/reporting'

export type ReportingType = {
  context: ReportingContext
  isFormDirty: boolean
  reporting: AtLeast<Reporting, 'id'>
}

export type SelectedReportingType = {
  [key: string]: ReportingType
}
type ReportingState = {
  activeReportingId: number | string | undefined
  isConfirmCancelDialogVisible: boolean
  reportings: SelectedReportingType
  selectedReportingIdOnMap: number | undefined
}

const initialState: ReportingState = {
  activeReportingId: undefined,
  isConfirmCancelDialogVisible: false,
  reportings: {},
  selectedReportingIdOnMap: undefined
}
const reportingSlice = createSlice({
  initialState,
  name: 'reporting',
  reducers: {
    deleteSelectedReporting(state, action) {
      if (state.reportings) {
        delete state.reportings[action.payload]
      }

      state.activeReportingId = undefined
    },
    setActiveReportingId(state, action: PayloadAction<number | string | undefined>) {
      state.activeReportingId = action.payload
    },
    setIsConfirmCancelDialogVisible(state, action: PayloadAction<boolean>) {
      state.isConfirmCancelDialogVisible = action.payload
    },
    setIsDirty(state, action: PayloadAction<boolean>) {
      const id = state.activeReportingId
      if (!id) {
        return
      }
      const reporting = state.reportings[id]

      if (reporting) {
        state.reportings[id] = {
          ...reporting,
          isFormDirty: action.payload
        }
      }
    },
    setReporting(state, action: PayloadAction<ReportingType>) {
      const { id } = action.payload.reporting
      if (!state.reportings) {
        state.reportings = { [id]: action.payload }
      } else {
        state.reportings[id] = action.payload
      }
    },
    setReportingContext(state, action: PayloadAction<ReportingContext>) {
      const id = state.activeReportingId
      if (!id) {
        return
      }
      const reporting = state.reportings[id]

      if (reporting) {
        state.reportings[id] = {
          ...reporting,
          context: action.payload
        }
      }
    },
    setReportingState(state, action: PayloadAction<Reporting>) {
      const id = state.activeReportingId
      if (!id) {
        return
      }
      const reporting = state.reportings[id]

      if (reporting) {
        state.reportings[id] = {
          ...reporting,
          reporting: action.payload
        }
      }
    },
    setSelectedReportingIdOnMap(state, action: PayloadAction<number | undefined>) {
      state.selectedReportingIdOnMap = action.payload
    }
  }
})
export const reportingActions = reportingSlice.actions

export const reportingSliceReducer = reportingSlice.reducer
