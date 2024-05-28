import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import type { InterestPoint, NewInterestPoint } from '../../features/InterestPoint/types'

export interface InterestPointState {
  currentInterestPoint: NewInterestPoint | null
  interestPoints: InterestPoint[]
  isDrawing: boolean
  isEditing: boolean
}

const INITIAL_STATE: InterestPointState = {
  currentInterestPoint: null,
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
      state.isDrawing = false
    },

    /**
     * Edit an existing interest point
     */
    editInterestPoint(state, action: PayloadAction<string>) {
      state.currentInterestPoint =
        state.interestPoints.find(interestPoint => interestPoint.uuid === action.payload) ?? null
      state.isEditing = true
    },

    /**
     * End drawing
     */
    endDrawingInterestPoint(state) {
      state.isDrawing = false
      state.isEditing = false
    },

    removeCurrentInterestPoint(state) {
      if (state.currentInterestPoint && !!state.currentInterestPoint.uuid) {
        removeInterestPoint(state.currentInterestPoint.uuid)
      }
      state.currentInterestPoint = null
    },

    /**
     * Delete an existing interest point
     */
    removeInterestPoint(state, action: PayloadAction<string>) {
      state.interestPoints = state.interestPoints.filter(interestPoint => interestPoint.uuid !== action.payload)
    },

    /**
     * Start drawing an interest point with a clickable map
     */
    startDrawingInterestPoint(state) {
      state.isDrawing = true
      state.isEditing = false
    },

    /**
     * Update the current interest point
     */
    updateCurrentInterestPoint(state, action: PayloadAction<NewInterestPoint | null>) {
      state.currentInterestPoint = action.payload
    },

    /**
     * Update the specified key of the current interest point
     */
    updateCurrentInterestPointProperty(
      state,
      action: PayloadAction<{
        key: keyof InterestPoint
        value: any
      }>
    ) {
      const currentInterestPoint = { ...state.currentInterestPoint }
      currentInterestPoint[action.payload.key] = action.payload.value
      // TODO Remove this cast. Used to ease JS => TS migration.
      state.currentInterestPoint = currentInterestPoint as InterestPoint

      if (state.isEditing) {
        state.interestPoints = state.interestPoints.map(interestPoint => {
          if (interestPoint.uuid === state.currentInterestPoint?.uuid) {
            interestPoint[action.payload.key] = action.payload.value
          }

          return interestPoint
        })
      }
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
  updateCurrentInterestPointProperty
} = interestPointSlice.actions

export const interestPointSlicePersistedReducer = persistReducer(persistConfig, interestPointSlice.reducer)
