import { createSlice } from '@reduxjs/toolkit'
import _ from "lodash";

/* eslint-disable */
/** @namespace AdministrativeReducer */
const AdministrativeReducer = null
/* eslint-enable */


const administrativeSlice = createSlice({
  name: 'administrative',
  initialState: {
    administrativeLayers: [],
    showedAdministrativeLayerIds:[],
  },
  reducers: {
    setAdministrativeLayers (state, action) {
      state.administrativeLayers = action.payload
    },
    /**
     * show AdministrativeLayer
     * @memberOf AdministrativeReducer
     * @param {Object=} state
     * @param {AdministrativeZone} action.payload - The regulatory zone
     */
    showAdministrativeLayer (state, action) {
      state.showedAdministrativeLayerIds = _.uniq(_.concat(state.showedAdministrativeLayerIds, action.payload))
    },
    /**
     * hide AdministrativeLayer
     * @memberOf AdministrativeReducer
     * @param {Object=} state
     * @param {AdministrativeZone} action.payload - The regulatory zone
     */
    hideAdministrativeLayer (state, action) {
      state.showedAdministrativeLayerIds = _.without(state.showedAdministrativeLayerIds, action.payload)
    },
  }
})

export const {
  showAdministrativeLayer,
  hideAdministrativeLayer,
  setAdministrativeLayers,
} = administrativeSlice.actions

export default administrativeSlice.reducer
