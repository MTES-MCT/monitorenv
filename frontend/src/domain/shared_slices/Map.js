import { createSlice } from '@reduxjs/toolkit'

import { baseLayers } from '../entities/layers'
import { CoordinatesFormat } from '../entities/map'


const mapSlice = createSlice({
  name: 'map',
  initialState: {
    fitToExtent: null,
    zoomToCenter: null,
    interaction: null,
    selectedBaseLayer: baseLayers.LIGHT.code,
    coordinatesFormat: CoordinatesFormat.DEGREES_MINUTES_SECONDS
  },
  reducers: {
    /**
     * 
     * @param {*} state 
     * @param {object} action.payload.extent
     */
    setFitToExtent (state, action) {
      state.fitToExtent = action.payload?.extent
    },
    setZoomToCenter (state, action) {
      state.zoomToCenter = action.payload
    },
    selectBaseLayer (state, action) {
      state.selectedBaseLayer = action.payload
    },
    /**
     * Start an interaction with the OpenLayers map, hence use the mouse to draw geometries
     * @param {Object=} state
     * @param {{payload: {
     *   type: (InteractionTypes.SQUARE|InteractionTypes.POLYGON),
     *   listener: (layersType.REGULATORY|layersType.VESSEL)
     * }}} action - The interaction type (see InteractionTypes enum) and listener (see layersType enum)
     */
    setInteraction (state, action) {
      state.interaction = action.payload
    },
    /**
     * Reset the interaction with the OpenLayers map
     * @param {Object=} state
     */
    resetInteraction (state) {
      state.interaction = null
    },
    /**
     * Set the coordinate format in the whole application (as DMS, DMD or DD)
     * @param {Object=} state
     * @param {{
     * payload: CoordinatesFormat}} action - The coordinate format
     */
    setCoordinatesFormat (state, action) {
      state.coordinatesFormat = action.payload
    }
  }
})

export const {
  setFitToExtent,
  setZoomToCenter,
  selectBaseLayer,
  setInteraction,
  resetInteraction,
  setCoordinatesFormat,
} = mapSlice.actions

export default mapSlice.reducer
