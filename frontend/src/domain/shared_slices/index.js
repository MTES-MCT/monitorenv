import { combineReducers } from '@reduxjs/toolkit'
import thunk from 'redux-thunk'

import global from './Global'
import administrative from './Administrative'
import layerSidebar from './LayerSidebar'
import map from './Map'
import layer from './Layer'
import measurement from './Measurement'
import interestPoint from './InterestPoint'
import regulatory from './Regulatory'
import gear from './Gear'
import species from './Species'

import { api } from '../../api/operationsApi'

import regulatoryLayerSearch from '../../features/layers/regulatory/search/RegulatoryLayerSearch.slice'


const commonReducerList = {
  map,
  global,
  regulatory,
  regulatoryLayerSearch,
  gear,
  species,
  administrative,
  layerSidebar
}

export const homeReducers = combineReducers({
  ...commonReducerList,
  [api.reducerPath]: api.reducer,
  layer: layer.homepage.reducer,
  interestPoint,
  measurement
})

// export const homeMiddlewares = getDefaultMiddleware => getDefaultMiddleware().concat(api.middleware)
export const homeMiddlewares = [thunk, api.middleware]