import { combineReducers } from '@reduxjs/toolkit'
import thunk from 'redux-thunk'

import { controlResourcesAPI } from '../../api/controlResourcesAPI'
import { controlThemesAPI } from '../../api/controlThemesAPI'
import { infractionsAPI } from '../../api/infractionsAPI'
import { missionsAPI } from '../../api/missionsAPI'
import { regulatoryLayersAPI } from '../../api/regulatoryLayersAPI'
import { sideWindowRouterReducer } from '../../components/SideWindowRouter/SideWindowRouter.slice'
import { drawLayerReducer } from '../../features/drawLayer/DrawLayer.slice'
import { regulatoryLayerSearchSliceReducer } from '../../features/layersSelector/regulatory/search/RegulatoryLayerSearch.slice'
import { administrativeSlicePersistedReducer } from './Administrative'
import { globalReducer } from './Global'
import { interestPointSlicePersistedReducer } from './InterestPoint'
import layerSidebar from './LayerSidebar'
import { mapSliceReducer } from './Map'
import { measurementSlicePersistedReducer } from './Measurement'
import { missionFiltersPersistedReducer } from './MissionFilters'
import { missionStateSliceReducer } from './MissionsState'
import { regulatorySlicePersistedReducer } from './Regulatory'
import { regulatoryMetadataSliceReducer } from './RegulatoryMetadata'

export const homeReducers = combineReducers({
  administrative: administrativeSlicePersistedReducer,
  drawLayer: drawLayerReducer,
  global: globalReducer,
  interestPoint: interestPointSlicePersistedReducer,
  layerSidebar,
  map: mapSliceReducer,
  measurement: measurementSlicePersistedReducer,
  missionFilters: missionFiltersPersistedReducer,
  missionState: missionStateSliceReducer,
  regulatory: regulatorySlicePersistedReducer,
  regulatoryLayerSearch: regulatoryLayerSearchSliceReducer,
  [regulatoryLayersAPI.reducerPath]: regulatoryLayersAPI.reducer,
  [missionsAPI.reducerPath]: missionsAPI.reducer,
  [controlThemesAPI.reducerPath]: controlThemesAPI.reducer,
  [controlResourcesAPI.reducerPath]: controlResourcesAPI.reducer,
  [infractionsAPI.reducerPath]: infractionsAPI.reducer,
  regulatoryMetadata: regulatoryMetadataSliceReducer,
  sideWindowRouter: sideWindowRouterReducer
})

// export const homeMiddlewares = getDefaultMiddleware => getDefaultMiddleware().concat(api.middleware)
export const homeMiddlewares = [
  thunk,
  missionsAPI.middleware,
  regulatoryLayersAPI.middleware,
  controlThemesAPI.middleware,
  controlResourcesAPI.middleware,
  infractionsAPI.middleware
]
