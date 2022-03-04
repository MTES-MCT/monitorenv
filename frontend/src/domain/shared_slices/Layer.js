import { createGenericSlice } from '../../utils/utils'

const initialState = {
  lastShowedFeatures: [],
  layersToFeatures: [],
  administrativeZonesGeometryCache: [],
  layersSidebarOpenedLayer: ''
}


const homepageInitialState = {
  ...initialState,
  showedLayers: []
}

const reducers = {
  addAdministrativeZoneGeometryToCache (state, action) {
    state.administrativeZonesGeometryCache = state.administrativeZonesGeometryCache.concat(action.payload)
  },
  /**
   * Store layer to feature and simplified feature - To show simplified features if the zoom is low
   * @param {Object=} state
   * @param {{payload: LayerToFeatures | null}} action - The layer and features
   */
  pushLayerToFeatures (state, action) {
    state.layersToFeatures = state.layersToFeatures.filter(layer => {
      return layer.name !== action.payload.name
    })
    state.layersToFeatures = state.layersToFeatures.concat(action.payload)
  },
  /**
   * Remove a layer and the features
   * @param {Object=} state
   * @param {{payload: string | null}} action - The layer name
   */
  removeLayerToFeatures (state, action) {
    state.layersToFeatures = state.layersToFeatures.filter(layer => {
      return layer.name !== action.payload
    })
  },
  setLastShowedFeatures (state, action) {
    state.lastShowedFeatures = action.payload
  },
  setLayersSideBarOpenedZone (state, action) {
    state.layersSidebarOpenedLayer = action.payload
  }
}

export default {
  homepage: createGenericSlice(homepageInitialState, reducers, 'HomePageLayerSlice'),
}
