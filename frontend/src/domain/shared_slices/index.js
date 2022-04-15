import { combineReducers } from '@reduxjs/toolkit'
import thunk from 'redux-thunk'

import map from './Map'
import global from './Global'
import { regulatorySlicePersistedReducer } from './Regulatory'
import { regulatoryMetadataSliceReducer } from './RegulatoryMetadata'
import regulatoryLayerSearch from '../../features/layers/regulatory/search/RegulatoryLayerSearch.slice'
import {administrativeSlicePersistedReducer} from './Administrative'
import layerSidebar from './LayerSidebar'
import { missionsAPI } from '../../api/missionsAPI'
import { regulatoryLayersAPI } from '../../api/regulatoryLayersAPI'
import { measurementSlicePersistedReducer } from './Measurement'
import { interestPointSlicePersistedReducer } from './InterestPoint'




export const homeReducers = combineReducers({
  map,
  global,
  administrative: administrativeSlicePersistedReducer,
  regulatory: regulatorySlicePersistedReducer,
  regulatoryMetadata: regulatoryMetadataSliceReducer,
  regulatoryLayerSearch,
  layerSidebar,
  [regulatoryLayersAPI.reducerPath]: regulatoryLayersAPI.reducer,
  [missionsAPI.reducerPath]: missionsAPI.reducer,
  interestPoint: interestPointSlicePersistedReducer,
  measurement: measurementSlicePersistedReducer
})

// export const homeMiddlewares = getDefaultMiddleware => getDefaultMiddleware().concat(api.middleware)
export const homeMiddlewares = [thunk, missionsAPI.middleware, regulatoryLayersAPI.middleware]