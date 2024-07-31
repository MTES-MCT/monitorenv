import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import { ReportingContext } from './Global'

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
  isListeningToEvents: boolean
  reportings: SelectedReportingType
  selectedReportingIdOnMap: number | string | undefined
}

const INITIAL_STATE: ReportingState = {
  activeReportingId: undefined,
  isConfirmCancelDialogVisible: false,
  isListeningToEvents: true,
  reportings: {},
  selectedReportingIdOnMap: undefined
}
const reportingSlice = createSlice({
  initialState: INITIAL_STATE,
  name: 'reporting',
  reducers: {
    deleteSelectedReporting(state, action) {
      const reportingIdToDelete = action.payload
      if (state.reportings) {
        delete state.reportings[reportingIdToDelete]
      }

      state.activeReportingId = undefined
      if (reportingIdToDelete === state.selectedReportingIdOnMap) {
        state.selectedReportingIdOnMap = undefined
      }
    },
    resetReportingsOnSideWindow(state, action: PayloadAction<Array<ReportingType>>) {
      const reportingsToDelete = action.payload
      reportingsToDelete.forEach(reporting => {
        if (state.activeReportingId === reporting.reporting.id) {
          state.activeReportingId = undefined
        }
        delete state.reportings[reporting.reporting.id]
      })
    },
    setActiveReportingId(state, action: PayloadAction<number | string | undefined>) {
      state.activeReportingId = action.payload
      state.selectedReportingIdOnMap = action.payload
    },
    setCreatedReporting(state, action: PayloadAction<{ createdReporting: ReportingType; previousId: string }>) {
      const { previousId } = action.payload
      const createdReportingId = action.payload.createdReporting.reporting.id
      if (!previousId || !createdReportingId) {
        return
      }
      const missionWithPreviousId = state.reportings[previousId]
      if (missionWithPreviousId) {
        delete state.reportings[previousId]
        state.reportings = { ...state.reportings, [createdReportingId]: action.payload.createdReporting }
      }
      state.activeReportingId = createdReportingId
      state.selectedReportingIdOnMap = createdReportingId
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
    setIsListeningToEvents(state, action: PayloadAction<boolean>) {
      state.isListeningToEvents = action.payload
    },
    setReporting(state, action: PayloadAction<ReportingType>) {
      const { id } = action.payload.reporting
      if (!id) {
        return
      }

      const reporting = state.reportings[id]
      if (reporting) {
        state.reportings[id] = action.payload
      } else {
        state.reportings = { ...state.reportings, [id]: action.payload }
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
    setReportingState(state, action: PayloadAction<AtLeast<Reporting, 'id'>>) {
      const { id } = action.payload
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
    },
    updateUnactiveReporting(state, action: PayloadAction<AtLeast<Partial<Reporting>, 'id'>>) {
      const { id } = action.payload

      // If the reporting is active, hence the form is open, the form will be updated from Formik (see FormikSyncMissionFields.ts)
      if (!id || id === state.activeReportingId) {
        return
      }

      const reporting = state.reportings[id]
      if (reporting) {
        state.reportings[id] = {
          ...reporting,
          reporting: {
            ...reporting.reporting,
            ...action.payload
          } as Reporting
        }
      }
    }
  }
})
export const reportingActions = reportingSlice.actions

export const reportingSliceReducer = reportingSlice.reducer
