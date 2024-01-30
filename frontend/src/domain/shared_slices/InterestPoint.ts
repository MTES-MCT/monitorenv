import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import type { InterestPoint, NewInterestPoint } from '../../features/InterestPoint/types'

interface InterestPointState {
  interestPointBeingDrawed: NewInterestPoint | null
  interestPoints: InterestPoint[]
  isDrawing: boolean
  isEditing: boolean
  triggerInterestPointFeatureDeletion: string | null
}

const INITIAL_STATE: InterestPointState = {
  interestPointBeingDrawed: null,
  interestPoints: [],
  isDrawing: false,
  isEditing: false,
  triggerInterestPointFeatureDeletion: null
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
      if (!state.isEditing && !!state.interestPointBeingDrawed) {
        state.interestPoints = state.interestPoints.concat(state.interestPointBeingDrawed as any)
      }
      state.isDrawing = false
      state.interestPointBeingDrawed = null
    },

    /**
     * Delete the interest point being drawed and trigger the deletion of the interest point feature currently showed
     */
    deleteInterestPointBeingDrawed(state) {
      if (state.interestPointBeingDrawed && !!state.interestPointBeingDrawed.uuid) {
        state.triggerInterestPointFeatureDeletion = state.interestPointBeingDrawed.uuid
      }
      state.interestPointBeingDrawed = null
    },

    /**
     * Start drawing an interest point with a clickable map
     */
    drawInterestPoint(state) {
      state.isDrawing = true
      state.isEditing = false
    },

    /**
     * Edit an existing interest point
     */
    editInterestPoint(state, action: PayloadAction<string>) {
      state.interestPointBeingDrawed =
        state.interestPoints.find(interestPoint => interestPoint.uuid === action.payload) ?? null
      state.isEditing = true
    },

    /**
     * End drawing
     */
    endInterestPointDraw(state) {
      state.isDrawing = false
      state.isEditing = false
    },

    /**
     * Delete an existing interest point
     */
    removeInterestPoint(state, action: PayloadAction<string>) {
      state.interestPoints = state.interestPoints.filter(interestPoint => interestPoint.uuid !== action.payload)
      state.isEditing = false
    },

    /**
     * Reset the trigger of the interest point deletion feature currently showed
     */
    resetInterestPointFeatureDeletion(state) {
      state.triggerInterestPointFeatureDeletion = null
    },

    /**
     * Update the interest point being drawed
     */
    updateInterestPointBeingDrawed(state, action: PayloadAction<NewInterestPoint | null>) {
      state.interestPointBeingDrawed = action.payload
    },

    /**
     * Update the specified key of the interest point being drawed
     */
    updateInterestPointKeyBeingDrawed(
      state,
      action: PayloadAction<{
        key: keyof InterestPoint
        value: any
      }>
    ) {
      const nextInterestPointBeingDrawed = { ...state.interestPointBeingDrawed }
      nextInterestPointBeingDrawed[action.payload.key] = action.payload.value
      // TODO Remove this cast. Used to ease JS => TS migration.
      state.interestPointBeingDrawed = nextInterestPointBeingDrawed as InterestPoint

      if (state.isEditing) {
        state.interestPoints = state.interestPoints.map(interestPoint => {
          if (!!state.interestPointBeingDrawed && interestPoint.uuid === state.interestPointBeingDrawed.uuid) {
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
  deleteInterestPointBeingDrawed,
  drawInterestPoint,
  editInterestPoint,
  endInterestPointDraw,
  removeInterestPoint,
  resetInterestPointFeatureDeletion,
  updateInterestPointBeingDrawed,
  updateInterestPointKeyBeingDrawed
} = interestPointSlice.actions

export const interestPointSlicePersistedReducer = persistReducer(persistConfig, interestPointSlice.reducer)
