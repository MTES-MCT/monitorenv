import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

type VesselState = {
  selectedVesselId?: number
}
const INITIAL_STATE: VesselState = {
  selectedVesselId: undefined
}
export const vesselSlice = createSlice({
  initialState: INITIAL_STATE,
  name: 'vessel',
  reducers: {
    setSelectedVesselId: (state, action: PayloadAction<number | undefined>): void => {
      state.selectedVesselId = action.payload
    }
  }
})

export const vesselAction = vesselSlice.actions
export const vesselReducer = vesselSlice.reducer
