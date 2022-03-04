import { combineReducers } from '@reduxjs/toolkit'

import global from './Global'
import map from './Map'
import layer from './Layer'
import measurement from './Measurement'
import interestPoint from './InterestPoint'
import regulatory from './Regulatory'
import gear from './Gear'
import species from './Species'

import regulatoryLayerSearch from '../../features/layers/regulatory/search/RegulatoryLayerSearch.slice'


const commonReducerList = {
  map,
  global,
  regulatory,
  regulatoryLayerSearch,
  gear,
  species
}

export const homeReducers = combineReducers({
  ...commonReducerList,
  layer: layer.homepage.reducer,
  interestPoint,
  measurement
})
