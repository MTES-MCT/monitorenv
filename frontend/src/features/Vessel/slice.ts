import { Vessel } from '@features/Vessel/types'
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

type VesselId = {
  batchId: number | undefined
  rowNumber: number | undefined
  shipId: number | undefined
}

type SelectedVessel = {
  batchId: number | undefined
  displayedPositions: Vessel.Position[] | undefined
  hasReportings: boolean | undefined
  rowNumber: number | undefined
  shipId: number | undefined
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
  selectedVessel: {
    batchId: undefined,
    displayedPositions: undefined,
    hasReportings: undefined,
    rowNumber: undefined,
    shipId: undefined
  }
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
    setSelectedVesselId: (state, action: PayloadAction<VesselId | undefined>): void => {
      state.selectedVessel.shipId = action.payload?.shipId
      state.selectedVessel.batchId = action.payload?.batchId
      state.selectedVessel.rowNumber = action.payload?.rowNumber
    }
  }
})

export const vesselAction = vesselSlice.actions
export const vesselReducer = vesselSlice.reducer
