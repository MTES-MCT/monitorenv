import { createSlice } from '@reduxjs/toolkit'

import { BaseLayer } from '../entities/layers/constants'
import { CoordinatesFormat, DistanceUnit } from '../entities/map/constants'

import type { Coordinate } from 'ol/coordinate'
import type { Extent } from 'ol/extent'

type MapSliceStateType = {
  coordinatesFormat: CoordinatesFormat
  currentMapExtentTracker?: number[]
  distanceUnit: DistanceUnit
  fitToExtent?: Extent
  selectedBaseLayer: string
  zoomToCenter?: Coordinate
}
const initialState: MapSliceStateType = {
  coordinatesFormat: CoordinatesFormat.DEGREES_MINUTES_SECONDS,
  currentMapExtentTracker: undefined,
  distanceUnit: DistanceUnit.NAUTICAL,
  fitToExtent: undefined,
  selectedBaseLayer: BaseLayer.LIGHT,
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
     * Set the distance unit in the whole application (as metrics, nautical)
     * @param {Object} state
     * @param {{
     * payload: DistanceUnit}} action - The distance unit
     */
    setDistanceUnit(state, action) {
      state.distanceUnit = action.payload
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

export const mapActions = mapSlice.actions
export const mapSliceReducer = mapSlice.reducer

export const {
  selectBaseLayer,
  setCoordinatesFormat,
  setCurrentMapExtentTracker,
  setDistanceUnit,
  setFitToExtent,
  setZoomToCenter
} = mapActions
