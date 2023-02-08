import { createSlice } from '@reduxjs/toolkit'

import { sideWindowPaths } from '../../domain/entities/sideWindow'

import type { PayloadAction } from '@reduxjs/toolkit'

export interface SideWindowState {
  // TODO Replace with an enum once `sideWindowPaths` is converted to an enum.
  currentPath: string
  hasBeenRenderedOnce: boolean
  isOpen: boolean
}
const INITIAL_STATE: SideWindowState = {
  currentPath: sideWindowPaths.MISSIONS,
  hasBeenRenderedOnce: false,
  isOpen: false
}

const sideWindowReducerSlice = createSlice({
  initialState: INITIAL_STATE,
  name: 'sideWindowReducer',
  reducers: {
    close(state) {
      state.isOpen = false
    },

    /**
     * Open the side window and set its route path
     */
    // TODO Replace with an enum once `sideWindowPaths` is converted to an enum.
    openAndGoTo(state, action: PayloadAction<string>) {
      state.isOpen = true
      state.currentPath = action.payload
    }
  }
})

export const sideWindowActions = sideWindowReducerSlice.actions
export const sideWindowReducer = sideWindowReducerSlice.reducer
