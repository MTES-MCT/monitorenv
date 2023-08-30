import { createSlice } from '@reduxjs/toolkit'

import type { Reporting } from '../entities/reporting'
import type { PayloadAction } from '@reduxjs/toolkit'

export enum ReportingFormVisibility {
  NONE = 'none',
  REDUCED = 'reduced',
  VISIBLE = 'visible',
  VISIBLE_LEFT = 'visible_left'
}

export enum ReportingContext {
  MAP = 'map',
  SIDE_WINDOW = 'side_window'
}

type ReportingState = {
  context: ReportingContext
  isConfirmCancelDialogVisible: boolean
  isFormDirty: boolean
  reportingState: Reporting | undefined
  selectedReportingId: number | string | undefined
  selectedReportingIdOnMap: number | undefined
}

const initialState: ReportingState = {
  context: ReportingContext.MAP,
  isConfirmCancelDialogVisible: false,
  isFormDirty: false,
  reportingState: undefined,
  selectedReportingId: undefined,
  selectedReportingIdOnMap: undefined
}
// reportingState.reportingState is juste a copy of the formik form state
// it can only be updated by the useSyncFormValuesWithRedux hook
const reportingStateSlice = createSlice({
  initialState,
  name: 'reportingState',
  reducers: {
    setIsConfirmCancelDialogVisible(state, action: PayloadAction<boolean>) {
      state.isConfirmCancelDialogVisible = action.payload
    },
    setIsDirty(state, action) {
      state.isFormDirty = action.payload
    },
    setReportingState(state, action) {
      state.reportingState = action.payload
    },
    setSelectedReportingId(state, action: PayloadAction<number | string | undefined>) {
      state.selectedReportingId = action.payload
    },
    setSelectedReportingIdOnMap(state, action: PayloadAction<number | undefined>) {
      state.selectedReportingIdOnMap = action.payload
    }
  }
})
export const reportingStateActions = reportingStateSlice.actions

export const reportingStateSliceReducer = reportingStateSlice.reducer
