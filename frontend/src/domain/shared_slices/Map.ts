import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import { BaseLayer, type RegulatoryOrAMPOrViglanceAreaLayerType } from '../entities/layers/constants'
import { CoordinatesFormat, DistanceUnit } from '../entities/map/constants'

import type { Coordinate } from 'ol/coordinate'
import type { Extent } from 'ol/extent'

type LayerType = {
  id: number | undefined
  type: RegulatoryOrAMPOrViglanceAreaLayerType
}

type MapSliceStateType = {
  coordinatesFormat: CoordinatesFormat
  currentMapExtentTracker?: number[]
  distanceUnit: DistanceUnit
  excludedLayers?: LayerType[]
  fitToExtent?: Extent
  isAreaSelected: boolean
  isolatedLayer: LayerType | undefined
  selectedBaseLayer: string
  zoomToCenter?: Coordinate
}
const initialState: MapSliceStateType = {
  coordinatesFormat: CoordinatesFormat.DEGREES_MINUTES_SECONDS,
  currentMapExtentTracker: undefined,
  distanceUnit: DistanceUnit.NAUTICAL,
  excludedLayers: [],
  fitToExtent: undefined,
  isAreaSelected: false,
  isolatedLayer: undefined,
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
    setFitToExtent(state, action: PayloadAction<Extent>) {
      state.fitToExtent = action.payload
    },
    setIsAreaSelected(state, action) {
      state.isAreaSelected = action.payload
    },
    setIsolateMode(
      state,
      action: PayloadAction<{ excludedLayers: LayerType[]; isolatedLayer: LayerType | undefined }>
    ) {
      state.isolatedLayer = action.payload.isolatedLayer
      state.excludedLayers = action.payload.excludedLayers
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
  setIsolateMode,
  setZoomToCenter
} = mapActions
