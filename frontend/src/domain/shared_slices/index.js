import { combineReducers } from '@reduxjs/toolkit'

import { administrativeSlicePersistedReducer } from './Administrative'
import { drawReducer } from './Draw'
import { globalReducer } from './Global'
import { interestPointSlicePersistedReducer } from './InterestPoint'
import layerSidebar from './LayerSidebar'
import { mapSliceReducer } from './Map'
import { measurementSlicePersistedReducer } from './Measurement'
import { missionFiltersPersistedReducer } from './MissionFilters'
import { missionStateSliceReducer } from './MissionsState'
import { multiMissionsSliceReducer } from './MultiMissions'
import { regulatorySlicePersistedReducer } from './Regulatory'
import { regulatoryMetadataSliceReducer } from './RegulatoryMetadata'
import { semaphoresPersistedReducer } from './SemaphoresSlice'
import { controlThemesAPI } from '../../api/controlThemesAPI'
import { controlUnitsAPI } from '../../api/controlUnitsAPI'
import { infractionsAPI } from '../../api/infractionsAPI'
import { missionsAPI } from '../../api/missionsAPI'
import { regulatoryLayersAPI } from '../../api/regulatoryLayersAPI'
import { semaphoresAPI } from '../../api/semaphoresAPI'
import { regulatoryLayerSearchSliceReducer } from '../../features/layersSelector/regulatory/search/RegulatoryLayerSearch.slice'
import { sideWindowReducer } from '../../features/SideWindow/slice'

export const homeReducers = combineReducers({
  administrative: administrativeSlicePersistedReducer,
  draw: drawReducer,
  global: globalReducer,
  interestPoint: interestPointSlicePersistedReducer,
  layerSidebar,
  map: mapSliceReducer,
  measurement: measurementSlicePersistedReducer,
  missionFilters: missionFiltersPersistedReducer,
  missionState: missionStateSliceReducer,
  multiMissions: multiMissionsSliceReducer,
  regulatory: regulatorySlicePersistedReducer,
  regulatoryLayerSearch: regulatoryLayerSearchSliceReducer,
  [regulatoryLayersAPI.reducerPath]: regulatoryLayersAPI.reducer,
  [missionsAPI.reducerPath]: missionsAPI.reducer,
  [controlThemesAPI.reducerPath]: controlThemesAPI.reducer,
  [controlUnitsAPI.reducerPath]: controlUnitsAPI.reducer,
  [infractionsAPI.reducerPath]: infractionsAPI.reducer,
  regulatoryMetadata: regulatoryMetadataSliceReducer,
  [semaphoresAPI.reducerPath]: semaphoresAPI.reducer,
  semaphoresSlice: semaphoresPersistedReducer,
  sideWindow: sideWindowReducer
})

export const homeMiddlewares = [
  missionsAPI.middleware,
  regulatoryLayersAPI.middleware,
  controlThemesAPI.middleware,
  controlUnitsAPI.middleware,
  infractionsAPI.middleware,
  semaphoresAPI.middleware
]
