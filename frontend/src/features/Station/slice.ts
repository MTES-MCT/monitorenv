import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface MainWindowState {
  highlightedFeatureIds: string[]
  selectedFeatureId: string | undefined
}
const INITIAL_STATE: MainWindowState = {
  highlightedFeatureIds: [],
  selectedFeatureId: undefined
}

const stationSlice = createSlice({
  initialState: INITIAL_STATE,
  name: 'station',
  reducers: {
    hightlightFeatureIds(state, action: PayloadAction<string[]>) {
      state.highlightedFeatureIds = action.payload
    },

    selectFeatureId(state, action: PayloadAction<string | undefined>) {
      state.selectedFeatureId = action.payload
    }
  }
})

export const stationActions = stationSlice.actions
export const stationReducer = stationSlice.reducer
