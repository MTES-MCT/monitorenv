import { createSlice } from '@reduxjs/toolkit'
import _ from 'lodash'
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
      state.showedAdministrativeLayerIds = _.without(state.showedAdministrativeLayerIds, action.payload)
    },

    /**
     * show AdministrativeLayer
     * @memberOf AdministrativeReducer
     * @param {Object} state
     * @param {Object} action
     * @param {AdministrativeZone} action.payload - The regulatory zone
     */
    showAdministrativeLayer(state, action) {
      state.showedAdministrativeLayerIds = _.uniq(_.concat(state.showedAdministrativeLayerIds, action.payload))
    }
  }
})

export const { hideAdministrativeLayer, showAdministrativeLayer } = administrativeSlice.actions

export const administrativeSlicePersistedReducer = persistReducer(persistConfig, administrativeSlice.reducer)
