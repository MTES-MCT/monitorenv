import { createSlice } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
  key: 'measurement',
  storage,
  whitelist: ['measurementsDrawed']
}

type MeasurementType = {
  coordinates: any
  feature: any
  measurement: any
}

const measurementSlice = createSlice({
  initialState: {
    circleMeasurementInDrawing: null,
    circleMeasurementToAdd: undefined as any,
    measurementsDrawed: [] as MeasurementType[],
    measurementTypeToAdd: null
  },
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
      state.circleMeasurementInDrawing = null
    },
    resetCircleMeasurementToAdd(state) {
      state.circleMeasurementToAdd = null
    },

    resetMeasurementTypeToAdd(state) {
      state.measurementTypeToAdd = null
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
  setMeasurementTypeToAdd
} = measurementSlice.actions

export const measurementSlicePersistedReducer = persistReducer(persistConfig, measurementSlice.reducer)
