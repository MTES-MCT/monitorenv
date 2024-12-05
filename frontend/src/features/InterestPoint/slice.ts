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

const newInterestPoint = () => ({ coordinates: undefined, name: undefined, observations: undefined, uuid: uuidv4() })

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
    cancelEditingInterestPoint(state) {
      state.currentInterestPoint = newInterestPoint()
      state.isEditing = false
    },
    /**
     * Edit an existing interest point
     */
    editInterestPoint(state, action: PayloadAction<string>) {
      state.currentInterestPoint =
        state.interestPoints.find(interestPoint => interestPoint.uuid === action.payload) ?? state.currentInterestPoint
      state.isEditing = true
    },

    /**
     * End drawing
     */
    endDrawingInterestPoint(state) {
      state.isDrawing = false
    },

    /**
     * Delete a persisted interest point
     */
    removeInterestPoint(state, action: PayloadAction<string>) {
      state.interestPoints = state.interestPoints.filter(interestPoint => interestPoint.uuid !== action.payload)
      if (state.currentInterestPoint.uuid === action.payload) {
        state.currentInterestPoint = newInterestPoint()
        state.isEditing = false
      }
    },

    removeUnsavedInterestPoint(state) {
      if (!state.interestPoints.find(interestPoint => interestPoint.uuid === state.currentInterestPoint.uuid)) {
        state.currentInterestPoint = newInterestPoint()
      }
    },

    /**
     * Add a new interest point
     */
    saveInterestPoint(state) {
      const index = state.interestPoints.findIndex(
        interestPoint => interestPoint.uuid === state.currentInterestPoint.uuid
      )

      if (index === -1) {
        state.interestPoints.push(state.currentInterestPoint as InterestPoint)
      } else {
        state.interestPoints[index] = state.currentInterestPoint as InterestPoint
      }

      state.currentInterestPoint = newInterestPoint()
      state.isEditing = false
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
    }
  }
})

export const {
  cancelEditingInterestPoint,
  editInterestPoint,
  endDrawingInterestPoint,
  removeInterestPoint,
  removeUnsavedInterestPoint,
  saveInterestPoint,
  startDrawingInterestPoint,
  updateCurrentInterestPoint
} = interestPointSlice.actions

export const interestPointSlicePersistedReducer = persistReducer(persistConfig, interestPointSlice.reducer)
