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
type MultiReportingsState = {
  activeReportingId: number | string | undefined
  isConfirmCancelDialogVisible: boolean
  selectedReportingId: number | string | undefined
  selectedReportingIdOnMap: number | undefined
  selectedReportings: SelectedReportingType
}

const initialState: MultiReportingsState = {
  activeReportingId: undefined,
  isConfirmCancelDialogVisible: false,
  selectedReportingId: undefined,
  selectedReportingIdOnMap: undefined,
  selectedReportings: {}
}
const multiReportingsSlice = createSlice({
  initialState,
  name: 'multiReportings',
  reducers: {
    deleteSelectedReporting(state, action) {
      if (state.selectedReportings) {
        delete state.selectedReportings[action.payload]
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
      const reporting = state.selectedReportings[id]

      if (reporting) {
        state.selectedReportings[id] = {
          ...reporting,
          isFormDirty: action.payload
        }
      }
    },
    setReporting(state, action: PayloadAction<ReportingType>) {
      const { id } = action.payload.reporting
      if (!state.selectedReportings) {
        state.selectedReportings = { [id]: action.payload }
      } else {
        state.selectedReportings[id] = action.payload
      }
      state.activeReportingId = id
    },
    setReportingContext(state, action: PayloadAction<ReportingContext>) {
      const id = state.activeReportingId
      if (!id) {
        return
      }
      const reporting = state.selectedReportings[id]

      if (reporting) {
        state.selectedReportings[id] = {
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
      const reporting = state.selectedReportings[id]

      if (reporting) {
        state.selectedReportings[id] = {
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
export const multiReportingsActions = multiReportingsSlice.actions

export const multiReportingsSliceReducer = multiReportingsSlice.reducer
