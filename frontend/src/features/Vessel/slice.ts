import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

type SelectedVessel = {
  hasReportings: boolean | undefined
  id: number | undefined
}
type VesselState = {
  selectedVessel: SelectedVessel
}
const INITIAL_STATE: VesselState = {
  selectedVessel: { hasReportings: undefined, id: undefined }
}
export const vesselSlice = createSlice({
  initialState: INITIAL_STATE,
  name: 'vessel',
  reducers: {
    setHasReportings: (state, action: PayloadAction<boolean | undefined>): void => {
      state.selectedVessel.hasReportings = action.payload
    },
    setSelectedVesselId: (state, action: PayloadAction<number | undefined>): void => {
      state.selectedVessel.id = action.payload
    }
  }
})

export const vesselAction = vesselSlice.actions
export const vesselReducer = vesselSlice.reducer
