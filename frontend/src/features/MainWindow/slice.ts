import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type { ConfirmationModalState, DialogState } from './types'

interface MainWindowState {
  /** Shared Confirmation Modal */
  confirmationModal: ConfirmationModalState | undefined

  /** Shared Dialog */
  dialog: DialogState | undefined

  // -----------------------------------
  // Components Visibility

  isConfirmationModalOpen: boolean
  isDialogOpen: boolean
}
const INITIAL_STATE: MainWindowState = {
  confirmationModal: undefined,
  dialog: undefined,

  // -----------------------------------
  // Components Visibility

  isConfirmationModalOpen: false,
  isDialogOpen: false
}

const mainWindowSlice = createSlice({
  initialState: INITIAL_STATE,
  name: 'mainWindow',
  reducers: {
    closeConfirmationModal(state) {
      state.confirmationModal = undefined
      state.isConfirmationModalOpen = false
    },

    closeDialog(state) {
      state.dialog = undefined
      state.isDialogOpen = false
    },

    openConfirmationModal(state, action: PayloadAction<ConfirmationModalState>) {
      state.confirmationModal = action.payload
      state.isConfirmationModalOpen = true
    },

    openDialog(state, action: PayloadAction<DialogState>) {
      state.dialog = action.payload
      state.isDialogOpen = true
    }
  }
})

export const mainWindowActions = mainWindowSlice.actions
export const mainWindowReducer = mainWindowSlice.reducer
