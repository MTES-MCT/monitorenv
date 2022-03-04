import { createSlice } from '@reduxjs/toolkit'

import { baseLayers } from '../entities/layers'
import { CoordinatesFormat } from '../entities/map'


const mapSlice = createSlice({
  name: 'map',
  initialState: {
    animateToCoordinates: null,
    animateToExtent: null,
    doNotAnimate: false,
    animateToRegulatoryLayer: null,
    interaction: null,
    selectedBaseLayer: baseLayers.LIGHT.code,
    coordinatesFormat: CoordinatesFormat.DEGREES_MINUTES_SECONDS
  },
  reducers: {
    doNotAnimate (state, action) {
      state.doNotAnimate = action.payload
    },
    /**
     * Animate map to the specified OpenLayers coordinates
     * @param {Object=} state
     * @param {{
     * payload: String[]
     * }} action - The OpenLayers internal [longitude, latitude] coordinates
     */
    animateToCoordinates (state, action) {
      state.animateToCoordinates = action.payload
    },
    resetAnimateToCoordinates (state) {
      state.animateToCoordinates = null
    },
    /**
     * Animate map to the vessel track extent stored in the Vessel reduced
     * @param {Object=} state
     */
    animateToExtent (state) {
      state.animateToExtent = true
    },
    resetAnimateToExtent (state) {
      state.animateToExtent = null
    },
    animateToRegulatoryLayer (state, action) {
      state.animateToRegulatoryLayer = action.payload
    },
    resetAnimateToRegulatoryLayer (state) {
      state.animateToRegulatoryLayer = null
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
  animateToCoordinates,
  resetAnimateToCoordinates,
  animateToExtent,
  resetAnimateToExtent,
  animateToRegulatoryLayer,
  resetAnimateToRegulatoryLayer,
  setVesselLabelsShowedOnMap,
  setVesselsLastPositionVisibility,
  setVesselTrackDepth,
  setVesselLabel,
  selectBaseLayer,
  setInteraction,
  resetInteraction,
  showVesselsEstimatedPositions,
  doNotAnimate,
  setCoordinatesFormat,
  setRiskFactorShowedOnMap,
  setHideVesselsAtPort
} = mapSlice.actions

export default mapSlice.reducer
