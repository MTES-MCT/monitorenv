import { combineReducers } from '@reduxjs/toolkit'
import thunk from 'redux-thunk'

import { sideWindowRouterReducer } from '../../components/SideWindowRouter/SideWindowRouter.slice'

import map from './Map'
import global from './Global'
import missionState from './MissionsState'
import { missionFiltersReducer } from './MissionFilters'
import { regulatorySlicePersistedReducer } from './Regulatory'
import { regulatoryMetadataSliceReducer } from './RegulatoryMetadata'
import regulatoryLayerSearch from '../../features/layersSelector/regulatory/search/RegulatoryLayerSearch.slice'
import { drawLayerReducer } from '../../features/drawLayer/DrawLayer.slice'
import {administrativeSlicePersistedReducer} from './Administrative'
import layerSidebar from './LayerSidebar'

import { missionsAPI } from '../../api/missionsAPI'
import { regulatoryLayersAPI } from '../../api/regulatoryLayersAPI'
import { controlThemesAPI } from '../../api/controlThemesAPI'
import { controlResourcesAPI } from '../../api/controlResourcesAPI'
import { infractionsAPI } from '../../api/infractionsAPI'

import { measurementSlicePersistedReducer } from './Measurement'
import { interestPointSlicePersistedReducer } from './InterestPoint'




export const homeReducers = combineReducers({
  map,
  global,
  missionState,
  missionFilters: missionFiltersReducer,
  administrative: administrativeSlicePersistedReducer,
  regulatory: regulatorySlicePersistedReducer,
  regulatoryMetadata: regulatoryMetadataSliceReducer,
  regulatoryLayerSearch,
  sideWindowRouter: sideWindowRouterReducer,
  drawLayer: drawLayerReducer,
  layerSidebar,
  [regulatoryLayersAPI.reducerPath]: regulatoryLayersAPI.reducer,
  [missionsAPI.reducerPath]: missionsAPI.reducer,
  [controlThemesAPI.reducerPath]: controlThemesAPI.reducer,
  [controlResourcesAPI.reducerPath]: controlResourcesAPI.reducer,
  [infractionsAPI.reducerPath]: infractionsAPI.reducer,
  interestPoint: interestPointSlicePersistedReducer,
  measurement: measurementSlicePersistedReducer
})

// export const homeMiddlewares = getDefaultMiddleware => getDefaultMiddleware().concat(api.middleware)
export const homeMiddlewares = [thunk, missionsAPI.middleware, regulatoryLayersAPI.middleware, 
    controlThemesAPI.middleware, controlResourcesAPI.middleware, infractionsAPI.middleware]