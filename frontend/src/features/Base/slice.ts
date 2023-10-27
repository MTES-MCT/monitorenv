import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface MainWindowState {
  selectedBaseFeatureId: string | undefined
}
const INITIAL_STATE: MainWindowState = {
  selectedBaseFeatureId: undefined
}

const baseSlice = createSlice({
  initialState: INITIAL_STATE,
  name: 'base',
  reducers: {
    selectBaseFeatureId(state, action: PayloadAction<string | undefined>) {
      state.selectedBaseFeatureId = action.payload
    }
  }
})

export const baseActions = baseSlice.actions
export const baseReducer = baseSlice.reducer
