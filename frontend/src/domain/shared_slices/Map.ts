import { createSlice } from '@reduxjs/toolkit'

import { BaseLayers } from '../entities/layers/constants'
import { CoordinatesFormat } from '../entities/map/constants'

import type { Coordinate } from 'ol/coordinate'
import type { Extent } from 'ol/extent'

type MapSliceStateType = {
  coordinatesFormat: CoordinatesFormat
  currentMapExtentTracker?: number[]
  fitToExtent?: Extent
  selectedBaseLayer: string
  zoomToCenter?: Coordinate
}
const initialState: MapSliceStateType = {
  coordinatesFormat: CoordinatesFormat.DEGREES_MINUTES_SECONDS,
  currentMapExtentTracker: undefined,
  fitToExtent: undefined,
  selectedBaseLayer: BaseLayers.LIGHT.code,
  zoomToCenter: undefined
}

const mapSlice = createSlice({
  initialState,
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
      state.fitToExtent = action.payload
    },

    setZoomToCenter(state, action) {
      state.zoomToCenter = action.payload
    }
  }
})

export const { selectBaseLayer, setCoordinatesFormat, setCurrentMapExtentTracker, setFitToExtent, setZoomToCenter } =
  mapSlice.actions

export const mapSliceReducer = mapSlice.reducer
