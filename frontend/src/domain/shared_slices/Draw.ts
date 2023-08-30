import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { isGeometryValid } from '../../utils/geometryValidation'

import type { InteractionListener, InteractionType } from '../entities/map/constants'
import type { GeoJSON } from '../types/GeoJSON'
import type { InteractionTypeAndListener } from '../types/map'

type DrawState = {
  geometry: GeoJSON.Geometry | undefined
  initialGeometry: GeoJSON.Geometry | undefined
  interactionType: InteractionType | undefined
  isGeometryValid: boolean | undefined
  listener: InteractionListener | undefined
}
const INITIAL_STATE: DrawState = {
  geometry: undefined,
  initialGeometry: undefined,
  interactionType: undefined,
  isGeometryValid: undefined,
  listener: undefined
}

const drawReducerSlice = createSlice({
  initialState: INITIAL_STATE,
  name: 'draw',
  reducers: {
    resetGeometry(state) {
      state.geometry = undefined
      state.isGeometryValid = undefined
    },

    /**
     * Reset the interaction with the OpenLayers map
     */
    resetInteraction(state) {
      state.interactionType = undefined
      state.listener = undefined
      state.geometry = undefined
      state.initialGeometry = undefined
    },

    setGeometry(state, action: PayloadAction<GeoJSON.Geometry>) {
      state.geometry = action.payload
      state.isGeometryValid = isGeometryValid(action.payload)
    },
    /**
     * Save the initial geometry value from form if user want to reinitialize the geometry
     */
    setInitialGeometry(state, action: PayloadAction<GeoJSON.Geometry>) {
      state.initialGeometry = action.payload
    },

    /**
     * Changes the interaction type
     * @see InteractionType
     */
    setInteractionType(state, action: PayloadAction<InteractionType>) {
      state.interactionType = action.payload
    },

    /**
     * Start an interaction with the OpenLayers map, hence use the mouse to draw geometries
     */
    setInteractionTypeAndListener(state, action: PayloadAction<InteractionTypeAndListener>) {
      state.interactionType = action.payload.type
      state.listener = action.payload.listener
    }
  }
})

export const {
  resetGeometry,
  resetInteraction,
  setGeometry,
  setInitialGeometry,
  setInteractionType,
  setInteractionTypeAndListener
} = drawReducerSlice.actions

export const drawReducer = drawReducerSlice.reducer
