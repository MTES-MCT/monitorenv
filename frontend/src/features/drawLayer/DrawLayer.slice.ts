import { createSlice } from '@reduxjs/toolkit'

import type Feature from 'ol/Feature'
import type { Geometry } from 'ol/geom'

const drawLayerReducerSlice = createSlice({
  initialState: {
    callback: null,

    features: [] as Feature<Geometry>[],

    /** Mission or control: see monitorenvFeatureTypesEnum  */
    featureType: null,
    /**  */
    interactionType: null
  },
  name: 'drawLayerReducer',
  reducers: {
    addFeature(state, action) {
      state.features.push(action.payload)
    },

    resetFeatures(state) {
      state.features = []
    },

    /**
     * Reset the interaction with the OpenLayers map
     * @param {Object=} state
     */
    resetInteraction(state) {
      state.featureType = null
      state.callback = null
      state.interactionType = null
    },

    setFeatures(state, action) {
      state.features = [...action.payload]
    },
    /**
     * Start an interaction with the OpenLayers map, hence use the mouse to draw geometries
     * @param {Object=} state
     * @param {{payload: {
     *    callback: function,
     *   featureType: (InteractionTypes.SQUARE|InteractionTypes.POLYGON|null),
     * }}} action - The interaction type (see InteractionTypes enum)
     */
    setFeatureType(state, action) {
      state.featureType = action.payload?.featureType
      state.callback = action.payload?.callback
    },
    setInteractionType(state, action) {
      state.interactionType = action.payload
    }
  }
})

export const { addFeature, resetFeatures, resetInteraction, setFeatures, setFeatureType, setInteractionType } =
  drawLayerReducerSlice.actions

export const drawLayerReducer = drawLayerReducerSlice.reducer
