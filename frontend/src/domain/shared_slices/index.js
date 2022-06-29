import { combineReducers } from '@reduxjs/toolkit'
import thunk from 'redux-thunk'

import map from './Map'
import global from './Global'
import { regulatorySlicePersistedReducer } from './Regulatory'
import { regulatoryMetadataSliceReducer } from './RegulatoryMetadata'
import regulatoryLayerSearch from '../../features/layers/regulatory/search/RegulatoryLayerSearch.slice'
import { sideWindowRouterReducer } from '../../features/commonComponents/SideWindowRouter/SideWindowRouter.slice'
import { drawLayerReducer } from '../../features/drawLayer/DrawLayer.slice'
import {administrativeSlicePersistedReducer} from './Administrative'
import layerSidebar from './LayerSidebar'

import { missionsAPI } from '../../api/missionsAPI'
import { regulatoryLayersAPI } from '../../api/regulatoryLayersAPI'
import { controlTopicsAPI } from '../../api/controlTopicsAPI'
import { controlResourcesAPI } from '../../api/controlResourcesAPI'
import { infractionsAPI } from '../../api/infractionsAPI'

import { measurementSlicePersistedReducer } from './Measurement'
import { interestPointSlicePersistedReducer } from './InterestPoint'




export const homeReducers = combineReducers({
  map,
  global,
  administrative: administrativeSlicePersistedReducer,
  regulatory: regulatorySlicePersistedReducer,
  regulatoryMetadata: regulatoryMetadataSliceReducer,
  regulatoryLayerSearch,
  sideWindowRouter: sideWindowRouterReducer,
  drawLayer: drawLayerReducer,
  layerSidebar,
  [regulatoryLayersAPI.reducerPath]: regulatoryLayersAPI.reducer,
  [missionsAPI.reducerPath]: missionsAPI.reducer,
  [controlTopicsAPI.reducerPath]: controlTopicsAPI.reducer,
  [controlResourcesAPI.reducerPath]: controlResourcesAPI.reducer,
  [infractionsAPI.reducerPath]: infractionsAPI.reducer,
  interestPoint: interestPointSlicePersistedReducer,
  measurement: measurementSlicePersistedReducer
})

// export const homeMiddlewares = getDefaultMiddleware => getDefaultMiddleware().concat(api.middleware)
export const homeMiddlewares = [thunk, missionsAPI.middleware, regulatoryLayersAPI.middleware, 
    controlTopicsAPI.middleware, controlResourcesAPI.middleware, infractionsAPI.middleware]