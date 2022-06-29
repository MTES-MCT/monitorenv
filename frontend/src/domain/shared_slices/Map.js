import { createSlice } from '@reduxjs/toolkit'

import { baseLayers } from '../entities/layers'
import { CoordinatesFormat } from '../entities/map'


const mapSlice = createSlice({
  name: 'map',
  initialState: {
    currentMapExtentTracker: null,
    fitToExtent: null,
    zoomToCenter: null,
    selectedBaseLayer: baseLayers.LIGHT.code,
    coordinatesFormat: CoordinatesFormat.DEGREES_MINUTES_SECONDS
  },
  reducers: {
    /**
     * currentMapExtent tracks the current map extent via MapHistory. 
     * setCurrentMapExtentTracker can not be used to change map extent
     * @param {*} state 
     * @param {{payload: ol.extent}} action 
     */
    setCurrentMapExtentTracker (state, action) {
      state.currentMapExtentTracker = action.payload
    },
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
  setCurrentMapExtentTracker,
  setFitToExtent,
  setZoomToCenter,
  selectBaseLayer,
  setCoordinatesFormat,
} = mapSlice.actions

export default mapSlice.reducer
