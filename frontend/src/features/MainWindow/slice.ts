import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface MainWindowState {
  hasFullHeightRightDialogOpen: boolean
  isRightMenuOpened: boolean
}
const INITIAL_STATE: MainWindowState = {
  hasFullHeightRightDialogOpen: false,
  isRightMenuOpened: false
}

const mainWindowSlice = createSlice({
  initialState: INITIAL_STATE,
  name: 'mainWindow',
  reducers: {
    setHasFullHeightRightDialogOpen(state, action: PayloadAction<boolean>) {
      state.hasFullHeightRightDialogOpen = action.payload
    },

    setIsRightMenuOpened(state, action: PayloadAction<boolean>) {
      state.isRightMenuOpened = action.payload
    }
  }
})

export const mainWindowActions = mainWindowSlice.actions
export const mainWindowReducer = mainWindowSlice.reducer
