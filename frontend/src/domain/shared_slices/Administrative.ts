import { createSlice } from '@reduxjs/toolkit'
import { concat, uniq, without } from 'lodash-es'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
  key: 'administrative',
  storage
}

const administrativeSlice = createSlice({
  initialState: {
    showedAdministrativeLayerIds: [] as number[]
  },
  name: 'administrative',
  reducers: {
    /**
     * hide AdministrativeLayer
     * @memberOf AdministrativeReducer
     * @param {Object} state
     * @param {Object} action
     * @param {AdministrativeZone} action.payload - The regulatory zone
     */
    hideAdministrativeLayer(state, action) {
      state.showedAdministrativeLayerIds = without(state.showedAdministrativeLayerIds, action.payload)
    },

    /**
     * show AdministrativeLayer
     * @memberOf AdministrativeReducer
     * @param {Object} state
     * @param {Object} action
     * @param {AdministrativeZone} action.payload - The regulatory zone
     */
    showAdministrativeLayer(state, action) {
      state.showedAdministrativeLayerIds = uniq(concat(state.showedAdministrativeLayerIds, action.payload))
    }
  }
})

export const { hideAdministrativeLayer, showAdministrativeLayer } = administrativeSlice.actions

export const administrativeSlicePersistedReducer = persistReducer(persistConfig, administrativeSlice.reducer)
