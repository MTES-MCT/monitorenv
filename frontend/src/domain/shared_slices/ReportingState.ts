import { createSlice } from '@reduxjs/toolkit'

import type { Reporting } from '../entities/reporting'
import type { PayloadAction } from '@reduxjs/toolkit'

export enum ReportingFormVisibility {
  NOT_VISIBLE = 'not_visible',
  REDUCE = 'reduce',
  VISIBLE = 'visible',
  VISIBLE_LEFT = 'visible_left'
}

type ReportingState = {
  isConfirmCancelDialogVisible: boolean
  isDirty: boolean
  nextSelectedReportingId: number | undefined
  reportingState: Reporting | undefined
  selectedReportingId: number | undefined
  selectedReportingIdOnMap: number | undefined
}

const initialState: ReportingState = {
  isConfirmCancelDialogVisible: false,
  isDirty: false,
  nextSelectedReportingId: undefined,
  reportingState: undefined,
  selectedReportingId: undefined,
  selectedReportingIdOnMap: undefined
}
const reportingStateSlice = createSlice({
  initialState,
  name: 'reportingState',
  reducers: {
    setIsConfirmCancelDialogVisible(state, action: PayloadAction<boolean>) {
      state.isConfirmCancelDialogVisible = action.payload
    },
    setIsDirty(state, action) {
      state.isDirty = action.payload
    },
    setNextSelectedReportingId(state, action: PayloadAction<number | undefined>) {
      state.nextSelectedReportingId = action.payload
    },
    setReportingState(state, action) {
      state.reportingState = action.payload
    },
    setSelectedReportingId(state, action: PayloadAction<number | undefined>) {
      state.selectedReportingId = action.payload
    },
    setSelectedReportingIdOnMap(state, action: PayloadAction<number | undefined>) {
      state.selectedReportingIdOnMap = action.payload
    }
  }
})
export const reportingStateActions = reportingStateSlice.actions

export const reportingStateSliceReducer = reportingStateSlice.reducer
