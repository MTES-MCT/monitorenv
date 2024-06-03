import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { v4 as uuidv4 } from 'uuid'

import type { NewInterestPoint, InterestPoint } from './types'

export interface InterestPointState {
  currentInterestPoint: NewInterestPoint
  interestPoints: InterestPoint[]
  isDrawing: boolean
  isEditing: boolean
}

const newInterestPoint = () => ({ coordinates: null, name: null, observations: null, uuid: uuidv4() })

const INITIAL_STATE: InterestPointState = {
  currentInterestPoint: newInterestPoint(),
  interestPoints: [],
  isDrawing: false,
  isEditing: false
}

const persistConfig = {
  key: 'interestPoint',
  storage,
  whitelist: ['interestPoints']
}

const interestPointSlice = createSlice({
  initialState: INITIAL_STATE,
  name: 'interestPoint',
  reducers: {
    /**
     * Add a new interest point
     */
    addInterestPoint(state) {
      if (!state.isEditing && !!state.currentInterestPoint) {
        state.interestPoints = state.interestPoints.concat(state.currentInterestPoint as InterestPoint)
      }
      state.currentInterestPoint = newInterestPoint()
      state.isEditing = false
    },

    /**
     * Edit an existing interest point
     */
    editInterestPoint(state, action: PayloadAction<string>) {
      state.currentInterestPoint =
        state.interestPoints.find(interestPoint => interestPoint.uuid === action.payload) ?? newInterestPoint()
      state.isEditing = true
    },

    /**
     * End drawing
     */
    endDrawingInterestPoint(state) {
      state.isDrawing = false
    },

    /**
     * Delete the current interest point
     */
    removeCurrentInterestPoint(state) {
      removeInterestPoint(state.currentInterestPoint.uuid)
      state.currentInterestPoint = newInterestPoint()
    },

    /**
     * Delete a persisted interest point
     */
    removeInterestPoint(state, action: PayloadAction<string>) {
      state.interestPoints = state.interestPoints.filter(interestPoint => interestPoint.uuid !== action.payload)
      if (state.currentInterestPoint.uuid === action.payload) {
        state.currentInterestPoint = newInterestPoint()
      }
    },

    /**
     * Start drawing an interest point
     */
    startDrawingInterestPoint(state) {
      state.isDrawing = true
    },

    /**
     * Update the current interest point
     */
    updateCurrentInterestPoint(state, action: PayloadAction<NewInterestPoint>) {
      state.currentInterestPoint = action.payload
    },

    /**
     * Update the specified key of the current interest point
     */
    updateInterestPointByProperty(
      state,
      action: PayloadAction<{
        key: keyof InterestPoint
        value: any
      }>
    ) {
      const currentInterestPoint = { ...state.currentInterestPoint }

      currentInterestPoint[action.payload.key] = action.payload.value
      state.currentInterestPoint = currentInterestPoint

      state.interestPoints = state.interestPoints.map(interestPoint => {
        if (interestPoint.uuid === state.currentInterestPoint?.uuid) {
          interestPoint[action.payload.key] = action.payload.value
        }

        return interestPoint
      })
    }
  }
})

export const {
  addInterestPoint,
  editInterestPoint,
  endDrawingInterestPoint,
  removeCurrentInterestPoint,
  removeInterestPoint,
  startDrawingInterestPoint,
  updateCurrentInterestPoint,
  updateInterestPointByProperty
} = interestPointSlice.actions

export const interestPointSlicePersistedReducer = persistReducer(persistConfig, interestPointSlice.reducer)
