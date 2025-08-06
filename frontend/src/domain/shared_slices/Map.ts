import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { BaseLayer } from 'domain/entities/layers/BaseLayer'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import { type RegulatoryOrAMPOrViglanceAreaLayerType } from '../entities/layers/constants'
import { CoordinatesFormat, DistanceUnit } from '../entities/map/constants'

import type { Coordinate } from 'ol/coordinate'
import type { Extent } from 'ol/extent'

const persistConfig = {
  key: 'map',
  storage,
  whitelist: ['coordinatesFormat', 'selectedBaseLayer']
}

export type IsolatedLayerType = {
  id: number
  isFilled: boolean
  type: RegulatoryOrAMPOrViglanceAreaLayerType
}

type LocateOnMap = {
  extent: Extent
  location: {
    id: string
    name: string
  }
}

type MapSliceStateType = {
  coordinatesFormat: CoordinatesFormat
  currentMapExtentTracker?: number[]
  distanceUnit: DistanceUnit
  fitToExtent?: Extent
  isAreaSelected: boolean
  isolatedLayer: IsolatedLayerType | undefined
  mapView: MapView
  locateOnMap: LocateOnMap | undefined
  selectedBaseLayer: BaseLayer
  zoomToCenter?: Coordinate
}

export type MapView = {
  bbox: Extent | undefined
  zoom: number | undefined
}

const initialState: MapSliceStateType = {
  coordinatesFormat: CoordinatesFormat.DEGREES_MINUTES_DECIMALS,
  currentMapExtentTracker: undefined,
  distanceUnit: DistanceUnit.NAUTICAL,
  fitToExtent: undefined,
  isAreaSelected: false,
  isolatedLayer: undefined,
  locateOnMap: undefined,
  mapView: { bbox: undefined, zoom: undefined },
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
    setIsolateMode(state, action: PayloadAction<IsolatedLayerType | undefined>) {
      state.isolatedLayer = action.payload
    },
    setMapView(state, action: PayloadAction<MapView>) {
      state.mapView = action.payload
    },
    setLocateOnMap(state, action: PayloadAction<LocateOnMap | undefined>) {
      state.locateOnMap = action.payload
    },
    setZoomToCenter(state, action) {
      state.zoomToCenter = action.payload
    }
  }
})

export const mapActions = mapSlice.actions
export const mapSliceReducer = persistReducer(persistConfig, mapSlice.reducer)

export const {
  selectBaseLayer,
  setCoordinatesFormat,
  setCurrentMapExtentTracker,
  setDistanceUnit,
  setFitToExtent,
  setIsolateMode,
  setLocateOnMap,
  setMapView,
  setZoomToCenter
} = mapActions
