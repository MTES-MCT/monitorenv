import { createSlice } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import type { MeasurementType } from '../entities/map/constants'

const persistConfig = {
  key: 'measurement',
  storage,
  whitelist: ['measurementsDrawed']
}

type CircleCoordinatesToAddType = {
  circleCoordinatesToAdd: any
  circleRadiusToAdd: any
}
type CircleMeasurementInDrawingType = {
  coordinates: number[]
  measurement: any
}

export type MeasurementState = {
  // TODO Type this prop.
  circleMeasurementInDrawing: CircleMeasurementInDrawingType | undefined
  // TODO Type this prop.
  circleMeasurementToAdd: CircleCoordinatesToAddType | undefined
  measurementTypeToAdd: MeasurementType | undefined
  // TODO Type this prop.
  measurementsDrawed: Record<string, any>[]
}

const INITIAL_STATE: MeasurementState = {
  circleMeasurementInDrawing: undefined,
  circleMeasurementToAdd: undefined,
  measurementsDrawed: [],
  measurementTypeToAdd: undefined
}

const measurementSlice = createSlice({
  initialState: INITIAL_STATE,
  name: 'measurement',
  reducers: {
    addMeasurementDrawed(state, action) {
      const nextMeasurementsDrawed = state.measurementsDrawed.concat(action.payload)

      state.measurementsDrawed = nextMeasurementsDrawed
    },
    removeMeasurementDrawed(state, action) {
      const nextMeasurementsDrawed = state.measurementsDrawed.filter(
        measurement => measurement.feature.id !== action.payload
      )

      state.measurementsDrawed = nextMeasurementsDrawed
    },
    resetCircleMeasurementInDrawing(state) {
      state.circleMeasurementInDrawing = undefined
    },
    resetCircleMeasurementToAdd(state) {
      state.circleMeasurementToAdd = undefined
    },

    resetMeasurementTypeToAdd(state) {
      state.measurementTypeToAdd = undefined
    },

    /**
     * Add a circle measurement currently in drawing mode - so the
     * current measurement done in the map is showed in the Measurement box
     * @param {Object} state
     * @param {{
     *  payload: {
          circleCoordinates: string
          circleRadius: string
        }
     * }} action - The coordinates and radius of the measurement
     */
    setCircleMeasurementInDrawing(state, action) {
      state.circleMeasurementInDrawing = action.payload
    },

    /**
     * Add a circle measurement to the measurements list from the measurement input form
     * @param {Object} state
     * @param {{
     *  payload: {
          circleCoordinatesToAdd: string
          circleRadiusToAdd: string
        }
     * }} action - The coordinates and radius of the measurement
     */
    setCircleMeasurementToAdd(state, action) {
      state.circleMeasurementToAdd = action.payload
    },

    setMeasurementDrawedDistanceUnit(state, action) {
      state.measurementsDrawed = action.payload
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
  resetCircleMeasurementToAdd,
  resetMeasurementTypeToAdd,
  setCircleMeasurementInDrawing,
  setCircleMeasurementToAdd,
  setMeasurementDrawedDistanceUnit,
  setMeasurementTypeToAdd
} = measurementSlice.actions

export const measurementSlicePersistedReducer = persistReducer(persistConfig, measurementSlice.reducer)
