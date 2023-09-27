import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type { BackOfficeConfirmationModalActionType } from '../use_cases/backOffice/types'

type BackOfficeState = {
  confirmationModalActionId: number
  confirmationModalActionType: BackOfficeConfirmationModalActionType | undefined
  confirmationModalMessage: string | undefined

  isConfirmationModalOpen: boolean
}
const INITIAL_STATE: BackOfficeState = {
  confirmationModalActionId: -1,
  confirmationModalActionType: undefined,
  confirmationModalMessage: undefined,

  isConfirmationModalOpen: false
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
    }
  }
})

export const { closeConfirmationModal, openConfirmationModal } = backOfficeSlice.actions

export const backOfficeActions = backOfficeSlice.actions
export const backOfficeReducer = backOfficeSlice.reducer
