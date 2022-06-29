import { createSlice } from '@reduxjs/toolkit'

/* eslint-disable */
/** @namespace DrawLayerReducer */
const DrawLayerReducer = null
/* eslint-enable */


const drawLayerReducerSlice = createSlice({
  name: 'drawLayerReducer',
  initialState: {
    featureType: null,
    isDrawing: true,
    geometryType: null,
    listener: null,
    callback: null,
    features: []
  },
  reducers: {
    /**
     * Start an interaction with the OpenLayers map, hence use the mouse to draw geometries
     * @param {Object=} state
     * @param {{payload: {
     *   geometryType: (InteractionTypes.SQUARE|InteractionTypes.POLYGON),
     *   listener: (layersType.REGULATORY)
     * }}} action - The interaction type (see InteractionTypes enum) and listener (see layersType enum)
     */
    setFeatureType (state, action) {
      state.featureType = action.payload?.featureType
      state.callback = action.payload?.callback
    },
    setGeometryType (state, action) {
      state.geometryType = action.payload
    },
    /**
     * Reset the interaction with the OpenLayers map
     * @param {Object=} state
     */
    resetInteraction (state) {
      state.features = []
      state.geometryType = null
      state.listener = null
      state.callback = null
    },
    addFeature(state, action) {
      state.features.push(action.payload)
    },
    addFeatures(state, action) {
      state.features = [...state.features, ...action.payload]
    },
    resetFeatures(state) {
      state.features = []
    }
  }
})

export const {
  setFeatureType,
  setGeometryType,
  resetInteraction,
  addFeature,
  addFeatures,
  resetFeatures
} = drawLayerReducerSlice.actions

export const drawLayerReducer = drawLayerReducerSlice.reducer;
