import { Vessel } from '@features/Vessel/types'
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

type SelectedVessel = {
  displayedPositions: Vessel.Position[] | undefined
  hasReportings: boolean | undefined
  id: number | undefined
}

type SelectedPosition = {
  featureId: string | number | undefined
}

type VesselState = {
  selectedPosition: SelectedPosition
  selectedVessel: SelectedVessel
}
const INITIAL_STATE: VesselState = {
  selectedPosition: { featureId: undefined },
  selectedVessel: { displayedPositions: undefined, hasReportings: undefined, id: undefined }
}
export const vesselSlice = createSlice({
  initialState: INITIAL_STATE,
  name: 'vessel',
  reducers: {
    resetState: () => INITIAL_STATE,
    setDisplayedPositions: (state, action: PayloadAction<Vessel.Position[] | undefined>): void => {
      state.selectedVessel.displayedPositions = action.payload
    },
    setHasReportings: (state, action: PayloadAction<boolean | undefined>): void => {
      state.selectedVessel.hasReportings = action.payload
    },
    setSelectedFeatureId: (state, action: PayloadAction<string | number | undefined>): void => {
      state.selectedPosition.featureId = action.payload
    },
    setSelectedVesselId: (state, action: PayloadAction<number | undefined>): void => {
      state.selectedVessel.id = action.payload
    }
  }
})

export const vesselAction = vesselSlice.actions
export const vesselReducer = vesselSlice.reducer
