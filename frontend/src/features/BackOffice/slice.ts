import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type { ConfirmationModalState, DialogState } from './types'

interface BackOfficeState {
  /** Shared Confirmation Modal */
  confirmationModal: ConfirmationModalState | undefined

  /** Shared Dialog */
  dialog: DialogState | undefined

  isConfirmationModalOpen: boolean
  isDialogOpen: boolean
}
const INITIAL_STATE: BackOfficeState = {
  confirmationModal: undefined,
  dialog: undefined,

  isConfirmationModalOpen: false,
  isDialogOpen: false
}

const backOfficeSlice = createSlice({
  initialState: INITIAL_STATE,
  name: 'backOffice',
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

export const backOfficeActions = backOfficeSlice.actions
export const backOfficeReducer = backOfficeSlice.reducer
