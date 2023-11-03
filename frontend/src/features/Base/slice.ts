import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface MainWindowState {
  highlightedFeatureIds: string[]
  selectedBaseFeatureId: string | undefined
}
const INITIAL_STATE: MainWindowState = {
  highlightedFeatureIds: [],
  selectedBaseFeatureId: undefined
}

const baseSlice = createSlice({
  initialState: INITIAL_STATE,
  name: 'base',
  reducers: {
    hightlightFeatureIds(state, action: PayloadAction<string[]>) {
      state.highlightedFeatureIds = action.payload
    },

    selectBaseFeatureId(state, action: PayloadAction<string | undefined>) {
      state.selectedBaseFeatureId = action.payload
    }
  }
})

export const baseActions = baseSlice.actions
export const baseReducer = baseSlice.reducer
