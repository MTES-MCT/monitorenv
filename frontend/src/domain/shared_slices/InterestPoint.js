import { createSlice } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

/* eslint-disable */
/** @namespace InterestPointReducer */
const InterestPointReducer = null
/* eslint-enable */


const persistConfig = {
  key: 'interestPoint',
  storage,
  whitelist: ['interestPoints']
};

const interestPointSlice = createSlice({
  name: 'interestPoint',
  initialState: {
    isDrawing: false,
    isEditing: false,
    /** @type {InterestPoint | null} interestPointBeingDrawed */
    interestPointBeingDrawed: null,
    /** @type {InterestPoint[]} interestPoints */
    interestPoints: [],
    triggerInterestPointFeatureDeletion: null
  },
  reducers: {
    /**
     * Start drawing an interest point with a clickable map
     * @function drawInterestPoint
     * @memberOf InterestPointReducer
     * @param {Object=} state
     */
    drawInterestPoint (state) {
      state.isDrawing = true
      state.isEditing = false
    },
    /**
     * End drawing
     * @function endInterestPointDraw
     * @memberOf InterestPointReducer
     * @param {Object=} state
     */
    endInterestPointDraw (state) {
      state.isDrawing = false
      state.isEditing = false
    },
    /**
     * Add a new interest point
     * @function addInterestPoint
     * @memberOf InterestPointReducer
     * @param {Object=} state
     */
    addInterestPoint (state) {
      if (!state.isEditing) {
        state.interestPoints = state.interestPoints.concat(state.interestPointBeingDrawed)
      }
      state.isDrawing = false
      state.interestPointBeingDrawed = null
    },
    /**
     * Delete an existing interest point
     * @function removeInterestPoint
     * @memberOf InterestPointReducer
     * @param {Object=} state
     * @param {{
     * payload: string
     * }} action - The UUID of the interest point
     */
    removeInterestPoint (state, action) {
      state.interestPoints = state.interestPoints.filter(interestPoint => interestPoint.uuid !== action.payload)
      state.isEditing = false
    },
    /**
     * Edit an existing interest point
     * @function editInterestPoint
     * @memberOf InterestPointReducer
     * @param {Object=} state
     * @param {{
     * payload: string
     * }} action - The UUID of the interest point
     */
    editInterestPoint (state, action) {
      state.interestPointBeingDrawed = state.interestPoints.find(interestPoint => interestPoint.uuid === action.payload)
      state.isEditing = true
    },
    /**
     * Update the interest point being drawed
     * @function updateInterestPointBeingDrawed
     * @memberOf InterestPointReducer
     * @param {Object=} state
     * @param {{
     * payload: InterestPoint | null
     * }} action - The interest point to add
     */
    updateInterestPointBeingDrawed (state, action) {
      state.interestPointBeingDrawed = action.payload
    },
    /**
     * Delete the interest point being drawed and trigger the deletion of the interest point feature currently showed
     * @function deleteInterestPointBeingDrawed
     * @memberOf InterestPointReducer
     * @param {Object=} state
     */
    deleteInterestPointBeingDrawed (state) {
      if (state.interestPointBeingDrawed) {
        state.triggerInterestPointFeatureDeletion = state.interestPointBeingDrawed.uuid
      }
      state.interestPointBeingDrawed = null
    },
    /**
     * Update the specified key of the interest point being drawed
     * @function updateInterestPointBeingDrawed
     * @memberOf InterestPointReducer
     * @param {Object=} state
     * @param {{
     * payload: {
     *   key: string
     *   value: any
     * }
     * }} action - The interest point to add
     */
    updateInterestPointKeyBeingDrawed (state, action) {
      const nextInterestPointBeingDrawed = { ...state.interestPointBeingDrawed }
      nextInterestPointBeingDrawed[action.payload.key] = action.payload.value
      state.interestPointBeingDrawed = nextInterestPointBeingDrawed

      if (state.isEditing) {
        state.interestPoints = state.interestPoints.map(interestPoint => {
          if (interestPoint.uuid === state.interestPointBeingDrawed.uuid) {
            interestPoint[action.payload.key] = action.payload.value
          }

          return interestPoint
        })
      }
    },
    /**
     * Reset the trigger of the interest point deletion feature currently showed
     * @function resetInterestPointFeatureDeletion
     * @memberOf InterestPointReducer
     * @param {Object=} state
     */
    resetInterestPointFeatureDeletion (state) {
      state.triggerInterestPointFeatureDeletion = null
    }
  }
})

export const {
  drawInterestPoint,
  endInterestPointDraw,
  addInterestPoint,
  removeInterestPoint,
  editInterestPoint,
  updateInterestPointBeingDrawed,
  updateInterestPointKeyBeingDrawed,
  deleteInterestPointBeingDrawed,
  resetInterestPointFeatureDeletion
} = interestPointSlice.actions

export const interestPointSlicePersistedReducer = persistReducer(persistConfig, interestPointSlice.reducer);

