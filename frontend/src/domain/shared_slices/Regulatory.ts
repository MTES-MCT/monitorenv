import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import _ from 'lodash'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
  key: 'regulatory',
  storage,
  whitelist: ['selectedRegulatoryLayerIds', 'showedRegulatoryLayerIds']
}

type RegulatorySliceState = {
  selectedRegulatoryLayerIds: number[]
  showedRegulatoryLayerIds: number[]
}
const initialState: RegulatorySliceState = {
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
     * @param {layerId[]} action.payload - The regulatory zone ids
     */
    addRegulatoryZonesToMyLayers(state, action: PayloadAction<number[]>) {
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
    hideRegulatoryLayer(state, action: PayloadAction<number>) {
      state.showedRegulatoryLayerIds = _.without(state.showedRegulatoryLayerIds, action.payload)
    },
    hideRegulatoryLayers(state, action: PayloadAction<number[]>) {
      state.showedRegulatoryLayerIds = _.without(state.showedRegulatoryLayerIds, ...action.payload)
    },

    /**
     * Remove regulatory zone(s) from "My Zones" regulatory selection, by providing a topic name to remove multiple zones
     * or simply the zone name to remove a specified zone
     * @memberOf RegulatoryReducer
     * @param {Object} state
     * @param {layerId[]} action - The regulatory zones to remove
     */
    removeRegulatoryZonesFromMyLayers(state, action: PayloadAction<number[]>) {
      return {
        ...state,
        selectedRegulatoryLayerIds: _.difference(state.selectedRegulatoryLayerIds, action.payload),
        showedRegulatoryLayerIds: _.difference(state.showedRegulatoryLayerIds, action.payload)
      }
    },

    showRegulatoryLayer(state, action: PayloadAction<number | number[]>) {
      state.showedRegulatoryLayerIds = _.uniq(_.concat(state.showedRegulatoryLayerIds, action.payload))
    }
  }
})

export const {
  addRegulatoryZonesToMyLayers,
  hideRegulatoryLayer,
  hideRegulatoryLayers,
  removeRegulatoryZonesFromMyLayers,
  showRegulatoryLayer
} = regulatorySlice.actions

export const regulatorySlicePersistedReducer = persistReducer(persistConfig, regulatorySlice.reducer)
