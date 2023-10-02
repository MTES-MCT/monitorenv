import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type { BackOfficeConfirmationModalActionType } from '../use_cases/backOffice/types'

type BackOfficeState = {
  confirmationModalActionId: number
  confirmationModalActionType: BackOfficeConfirmationModalActionType | undefined
  confirmationModalMessage: string | undefined

  dialogMessage: string | undefined

  isConfirmationModalOpen: boolean
  isDialogOpen: boolean
}
const INITIAL_STATE: BackOfficeState = {
  confirmationModalActionId: -1,
  confirmationModalActionType: undefined,
  confirmationModalMessage: undefined,

  dialogMessage: undefined,

  isConfirmationModalOpen: false,
  isDialogOpen: false
}

const backOfficeSlice = createSlice({
  initialState: INITIAL_STATE,
  name: 'backOffice',
  reducers: {
    closeConfirmationModal(state) {
      state.confirmationModalActionId = -1
      state.confirmationModalActionType = undefined
      state.confirmationModalMessage = undefined
      state.isConfirmationModalOpen = false
    },

    closeDialog(state) {
      state.dialogMessage = undefined
      state.isDialogOpen = false
    },

    openConfirmationModal(
      state,
      action: PayloadAction<{
        actionId: number
        actionType: BackOfficeConfirmationModalActionType
        message: string
      }>
    ) {
      state.confirmationModalActionId = action.payload.actionId
      state.confirmationModalActionType = action.payload.actionType
      state.confirmationModalMessage = action.payload.message
      state.isConfirmationModalOpen = true
    },

    openDialog(
      state,
      action: PayloadAction<{
        message: string
      }>
    ) {
      state.dialogMessage = action.payload.message
      state.isDialogOpen = true
    }
  }
})

export const { closeConfirmationModal, openConfirmationModal } = backOfficeSlice.actions

export const backOfficeActions = backOfficeSlice.actions
export const backOfficeReducer = backOfficeSlice.reducer
