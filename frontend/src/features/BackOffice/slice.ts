import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type { DialogState } from './types'

interface BackOfficeState {
  /** Shared Dialog */
  dialog: DialogState | undefined

  isDialogOpen: boolean
}
const INITIAL_STATE: BackOfficeState = {
  dialog: undefined,

  isDialogOpen: false
}

const backOfficeSlice = createSlice({
  initialState: INITIAL_STATE,
  name: 'backOffice',
  reducers: {
    closeDialog(state) {
      state.dialog = undefined
      state.isDialogOpen = false
    },

    openDialog(state, action: PayloadAction<DialogState>) {
      state.dialog = action.payload
      state.isDialogOpen = true
    }
  }
})

export const backOfficeActions = backOfficeSlice.actions
export const backOfficeReducer = backOfficeSlice.reducer
