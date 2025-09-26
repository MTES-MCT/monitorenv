import { createSlice } from '@reduxjs/toolkit'
import { concat, difference, union, uniq, without } from 'lodash-es'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
  key: 'amp',
  storage,
  whitelist: ['selectedAmpLayerIds', 'showedAmpLayerIds']
}

type AmpSliceState = {
  selectedAmpLayerIds: number[]
  showedAmpLayerIds: number[]
}
const initialState: AmpSliceState = {
  selectedAmpLayerIds: [],
  showedAmpLayerIds: []
}

const ampSlice = createSlice({
  initialState,
  name: 'amp',
  reducers: {
    /**
     * Add amp zones to "My Zones" amp selection
     * @memberOf AmpReducer
     * @param {Object} state
     * @param {layerId[]} action.payload - The amp zones
     */
    addAmpZonesToMyLayers(state, action) {
      return {
        ...state,
        selectedAmpLayerIds: union(state.selectedAmpLayerIds, action.payload),
        showedAmpLayerIds: union(state.showedAmpLayerIds, action.payload)
      }
    },

    /**
     * hide AmpLayer
     * @memberOf AmpReducer
     * @param {Object} state
     * @param {number} action.payload - The amp zone id
     */
    hideAmpLayer(state, action) {
      state.showedAmpLayerIds = without(state.showedAmpLayerIds, action.payload)
    },
    hideAmpLayers(state, action) {
      state.showedAmpLayerIds = without(state.showedAmpLayerIds, ...action.payload)
    },

    /**
     * Remove amp zone(s) from "My Zones" amp selection, by providing a topic name to remove multiple zones
     * or simply the zone name to remove a specified zone
     * @memberOf AmpReducer
     * @param {Object} state
     * @param {layerId[]} action - The amp zones to remove
     */
    removeAmpZonesFromMyLayers(state, action) {
      return {
        ...state,
        selectedAmpLayerIds: difference(state.selectedAmpLayerIds, action.payload),
        showedAmpLayerIds: difference(state.showedAmpLayerIds, action.payload)
      }
    },

    /**
     * show AmpLayer
     * @memberOf AmpReducer
     * @param {Object} state
     * @param {AmpZone[]} action.payload - The amp zone
     */
    showAmpLayer(state, action) {
      state.showedAmpLayerIds = uniq(concat(state.showedAmpLayerIds, action.payload))
    }
  }
})

export const { addAmpZonesToMyLayers, hideAmpLayer, hideAmpLayers, removeAmpZonesFromMyLayers, showAmpLayer } =
  ampSlice.actions

export const ampSlicePersistedReducer = persistReducer(persistConfig, ampSlice.reducer)
