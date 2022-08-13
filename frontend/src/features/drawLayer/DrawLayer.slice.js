import { createSlice } from '@reduxjs/toolkit'

/* eslint-disable */
/** @namespace DrawLayerReducer */
const DrawLayerReducer = null
/* eslint-enable */


const drawLayerReducerSlice = createSlice({
  name: 'drawLayerReducer',
  initialState: {
    /** Mission or control: see monitorenvFeatureTypesEnum  */
    featureType: null,
    /**  */
    interactionType: null,
    callback: null,
    features: []
  },
  reducers: {
    /**
     * Start an interaction with the OpenLayers map, hence use the mouse to draw geometries
     * @param {Object=} state
     * @param {{payload: {
     *   interactionType: (InteractionTypes.SQUARE|InteractionTypes.POLYGON|null),
     * }}} action - The interaction type (see InteractionTypes enum)
     */
    setFeatureType (state, action) {
      state.featureType = action.payload?.featureType
      state.callback = action.payload?.callback
    },
    setInteractionType (state, action) {
      state.interactionType = action.payload
    },
    /**
     * Reset the interaction with the OpenLayers map
     * @param {Object=} state
     */
    resetInteraction (state) {
      state.featureType = null
      state.callback = null
      state.interactionType = null
    },
    addFeature(state, action) {
      state.features.push(action.payload)
    },
    setFeatures(state, action) {
      state.features = [...action.payload]
    },
    resetFeatures(state) {
      state.features = []
    }
  }
})

export const {
  setFeatureType,
  setInteractionType,
  resetInteraction,
  addFeature,
  setFeatures,
  resetFeatures
} = drawLayerReducerSlice.actions

export const drawLayerReducer = drawLayerReducerSlice.reducer;
