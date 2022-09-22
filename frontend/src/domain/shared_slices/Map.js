import { createSlice } from '@reduxjs/toolkit'

import { baseLayers } from '../entities/layers'
import { CoordinatesFormat } from '../entities/map'

const mapSlice = createSlice({
  initialState: {
    coordinatesFormat: CoordinatesFormat.DEGREES_MINUTES_SECONDS,
    currentMapExtentTracker: null,
    fitToExtent: null,
    selectedBaseLayer: baseLayers.LIGHT.code,
    zoomToCenter: null
  },
  name: 'map',
  reducers: {
    selectBaseLayer(state, action) {
      state.selectedBaseLayer = action.payload
    },

    /**
     * Set the coordinate format in the whole application (as DMS, DMD or DD)
     * @param {Object} state
     * @param {{
     * payload: CoordinatesFormat}} action - The coordinate format
     */
    setCoordinatesFormat(state, action) {
      state.coordinatesFormat = action.payload
    },

    /**
     * currentMapExtent tracks the current map extent via MapHistory.
     * setCurrentMapExtentTracker can not be used to change map extent
     * @param {*} state
     * @param {{payload: ol.extent}} action
     */
    setCurrentMapExtentTracker(state, action) {
      state.currentMapExtentTracker = action.payload
    },

    /**
     *
     * @param {*} state
     * @param {object} action.payload.extent
     */
    setFitToExtent(state, action) {
      state.fitToExtent = action.payload?.extent
    },

    setZoomToCenter(state, action) {
      state.zoomToCenter = action.payload
    }
  }
})

export const { selectBaseLayer, setCoordinatesFormat, setCurrentMapExtentTracker, setFitToExtent, setZoomToCenter } =
  mapSlice.actions

export default mapSlice.reducer
