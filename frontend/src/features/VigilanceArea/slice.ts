import { createSlice } from '@reduxjs/toolkit'

type VigilanceAreaSliceState = {
  isFormOpen: boolean
}
const INITIAL_STATE: VigilanceAreaSliceState = {
  isFormOpen: false
}
export const vigilanceAreaSlice = createSlice({
  initialState: INITIAL_STATE,
  name: 'vigilanceArea',
  reducers: {
    closeForm(state) {
      state.isFormOpen = false
    },
    openForm(state) {
      state.isFormOpen = true
    }
  }
})

export const vigilanceAreaActions = vigilanceAreaSlice.actions
export const vigilanceAreaReducer = vigilanceAreaSlice.reducer
