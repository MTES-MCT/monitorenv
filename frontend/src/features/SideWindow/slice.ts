import { createSlice } from '@reduxjs/toolkit'

import { sideWindowPaths } from '../../domain/entities/sideWindow'

import type { PayloadAction } from '@reduxjs/toolkit'

enum SideWindowStatus {
  CLOSED = 'closed',
  HIDDEN = 'hidden',
  VISIBLE = 'visible'
}
export interface SideWindowState {
  // TODO Replace with an enum once `sideWindowPaths` is converted to an enum.
  currentPath: string
  hasBeenRenderedOnce: boolean
  status: string
}
const INITIAL_STATE: SideWindowState = {
  currentPath: sideWindowPaths.MISSIONS,
  hasBeenRenderedOnce: false,
  status: SideWindowStatus.CLOSED
}

const sideWindowReducerSlice = createSlice({
  initialState: INITIAL_STATE,
  name: 'sideWindowReducer',
  reducers: {
    close(state) {
      state.status = SideWindowStatus.CLOSED
    },
    onChangeStatus(state, action: PayloadAction<SideWindowStatus>) {
      state.status = action.payload
    },

    /**
     * Open the side window and set its route path
     */
    // TODO Replace with an enum once `sideWindowPaths` is converted to an enum.
    openAndGoTo(state, action: PayloadAction<string>) {
      state.currentPath = action.payload
      state.status = SideWindowStatus.VISIBLE
    }
  }
})

export const sideWindowActions = sideWindowReducerSlice.actions
export const sideWindowReducer = sideWindowReducerSlice.reducer
