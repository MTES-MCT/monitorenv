import { combineReducers } from '@reduxjs/toolkit'
import thunk from 'redux-thunk'

import map from './Map'
import global from './Global'
import { regulatorySlicePersistedReducer } from './Regulatory'
import regulatoryLayerSearch from '../../features/layers/regulatory/search/RegulatoryLayerSearch.slice'
import {administrativeSlicePersistedReducer} from './Administrative'
import layerSidebar from './LayerSidebar'
import { operationsApi } from '../../api/operationsApi'
import layer from './Layer'
import { measurementSlicePersistedReducer } from './Measurement'
import { interestPointSlicePersistedReducer } from './InterestPoint'




export const homeReducers = combineReducers({
  map,
  global,
  administrative: administrativeSlicePersistedReducer,
  regulatory: regulatorySlicePersistedReducer,
  regulatoryLayerSearch,
  layerSidebar,
  [operationsApi.reducerPath]: operationsApi.reducer,
  layer: layer.homepage.reducer,
  interestPoint: interestPointSlicePersistedReducer,
  measurement: measurementSlicePersistedReducer
})

// export const homeMiddlewares = getDefaultMiddleware => getDefaultMiddleware().concat(api.middleware)
export const homeMiddlewares = [thunk, operationsApi.middleware]