import { createSelector, createSlice } from '@reduxjs/toolkit'
import _ from 'lodash'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import type { HomeRootState } from '../../store'

const persistConfig = {
  key: 'regulatory',
  storage,
  whitelist: ['selectedRegulatoryLayerIds', 'showedRegulatoryLayerIds']
}

type RegulatorySliceState = {
  loadingRegulatoryZoneMetadata: boolean
  regulationSearchedZoneExtent: []
  regulatoryZoneMetadata: any
  selectedRegulatoryLayerIds: number[]
  showedRegulatoryLayerIds: number[]
}
const initialState: RegulatorySliceState = {
  loadingRegulatoryZoneMetadata: false,
  regulationSearchedZoneExtent: [],
  regulatoryZoneMetadata: null,
  selectedRegulatoryLayerIds: [],
  showedRegulatoryLayerIds: []
}

const regulatorySlice = createSlice({
  initialState,
  name: 'regulatory',
  reducers: {
    /**
     * Add regulatory zones to "My Zones" regulatory selection
     * @memberOf RegulatoryReducer
     * @param {Object} state
     * @param {layerId[]} action.payload - The regulatory zones
     */
    addRegulatoryZonesToMyLayers(state, action) {
      return {
        ...state,
        selectedRegulatoryLayerIds: _.union(state.selectedRegulatoryLayerIds, action.payload),
        showedRegulatoryLayerIds: _.union(state.showedRegulatoryLayerIds, action.payload)
      }
    },

    /**
     * hide RegulatoryLayer
     * @memberOf RegulatoryReducer
     * @param {Object} state
     * @param {number} action.payload - The regulatory zone id
     */
    hideRegulatoryLayer(state, action) {
      state.showedRegulatoryLayerIds = _.without(state.showedRegulatoryLayerIds, action.payload)
    },
    hideRegulatoryLayers(state, action) {
      state.showedRegulatoryLayerIds = _.without(state.showedRegulatoryLayerIds, ...action.payload)
    },

    /**
     * Remove regulatory zone(s) from "My Zones" regulatory selection, by providing a topic name to remove multiple zones
     * or simply the zone name to remove a specified zone
     * @memberOf RegulatoryReducer
     * @param {Object} state
     * @param {layerId[]} action - The regulatory zones to remove
     */
    removeRegulatoryZonesFromMyLayers(state, action) {
      return {
        ...state,
        selectedRegulatoryLayerIds: _.difference(state.selectedRegulatoryLayerIds, action.payload),
        showedRegulatoryLayerIds: _.difference(state.showedRegulatoryLayerIds, action.payload)
      }
    },

    /**
     * Set the regulation searched zone extent - used to fit the extent into the OpenLayers view
     * @function setRegulationSearchedZoneExtent
     * @memberOf RegulatoryReducer
     * @param {Object} state
     * @param {{payload: number[]}} action - the extent
     */
    setRegulationSearchedZoneExtent(state, action) {
      state.regulationSearchedZoneExtent = action.payload
    },
    /**
     * show RegulatoryLayer
     * @memberOf RegulatoryReducer
     * @param {Object} state
     * @param {RegulatoryZone[]} action.payload - The regulatory zone
     */
    showRegulatoryLayer(state, action) {
      state.showedRegulatoryLayerIds = _.uniq(_.concat(state.showedRegulatoryLayerIds, action.payload))
    }
  }
})

export const {
  addRegulatoryZonesToMyLayers,
  hideRegulatoryLayer,
  hideRegulatoryLayers,
  removeRegulatoryZonesFromMyLayers,
  setRegulationSearchedZoneExtent,
  showRegulatoryLayer
} = regulatorySlice.actions

export const regulatorySlicePersistedReducer = persistReducer(persistConfig, regulatorySlice.reducer)

export const getSelectedRegulatoryLayerIds = createSelector(
  [(state: HomeRootState) => state.regulatory.selectedRegulatoryLayerIds],
  selectedRegulatoryLayerIds => selectedRegulatoryLayerIds
)
