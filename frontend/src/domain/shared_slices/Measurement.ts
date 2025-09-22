import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import type { MeasurementType } from '../entities/map/constants'
import type { Measurement } from '@features/map/layers/measurement'

const persistConfig = {
  key: 'measurement',
  storage,
  whitelist: ['measurementsDrawed']
}

type CircleMeasurementInDrawingType = {
  center: number[] | undefined
  radius: number | undefined
}

export type MeasurementState = {
  customCircleMesurement: CircleMeasurementInDrawingType | undefined
  measurementTypeToAdd: MeasurementType | undefined
  measurementsDrawed: Measurement[]
}

const INITIAL_STATE: MeasurementState = {
  customCircleMesurement: undefined,
  measurementsDrawed: [],
  measurementTypeToAdd: undefined
}

const measurementSlice = createSlice({
  initialState: INITIAL_STATE,
  name: 'measurement',
  reducers: {
    addMeasurementDrawed(state, action: PayloadAction<Measurement>) {
      state.measurementsDrawed = state.measurementsDrawed.concat(action.payload)
    },
    removeMeasurementDrawed(state, action) {
      state.measurementsDrawed = state.measurementsDrawed.filter(
        measurement => measurement.feature?.id !== action.payload
      )
    },
    resetCircleMeasurementInDrawing(state) {
      state.customCircleMesurement = undefined
    },

    resetMeasurementTypeToAdd(state) {
      state.measurementTypeToAdd = undefined
    },

    setCustomCircleMesurement(state, action: PayloadAction<CircleMeasurementInDrawingType>) {
      state.customCircleMesurement = action.payload
    },

    setMeasurementTypeToAdd(state, action) {
      state.measurementTypeToAdd = action.payload
    }
  }
})

export const {
  addMeasurementDrawed,
  removeMeasurementDrawed,
  resetCircleMeasurementInDrawing,
  resetMeasurementTypeToAdd,
  setCustomCircleMesurement,
  setMeasurementTypeToAdd
} = measurementSlice.actions

export const measurementSlicePersistedReducer = persistReducer(persistConfig, measurementSlice.reducer)
