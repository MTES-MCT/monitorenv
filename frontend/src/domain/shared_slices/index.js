import { combineReducers } from '@reduxjs/toolkit'

import { ampsAPI } from '../../api/ampsAPI'
import { controlThemesAPI } from '../../api/controlThemesAPI'
import { controlUnitsAPI } from '../../api/controlUnitsAPI'
import { infractionsAPI } from '../../api/infractionsAPI'
import { missionsAPI } from '../../api/missionsAPI'
import { regulatoryLayersAPI } from '../../api/regulatoryLayersAPI'
import { semaphoresAPI } from '../../api/semaphoresAPI'
import { regulatoryLayerSearchSliceReducer } from '../../features/layersSelector/search/LayerSearch.slice'
import { sideWindowReducer } from '../../features/SideWindow/slice'
import { administrativeSlicePersistedReducer } from './Administrative'
import { drawReducer } from './Draw'
import { globalReducer } from './Global'
import { interestPointSlicePersistedReducer } from './InterestPoint'
import { layerSidebarSlice } from './LayerSidebar'
import { mapSliceReducer } from './Map'
import { measurementSlicePersistedReducer } from './Measurement'
import { missionFiltersPersistedReducer } from './MissionFilters'
import { missionStateSliceReducer } from './MissionsState'
import { multiMissionsSliceReducer } from './MultiMissions'
import { regulatorySlicePersistedReducer } from './Regulatory'
import { regulatoryMetadataSliceReducer } from './RegulatoryMetadata'
import { selectedAmpSlicePersistedReducer } from './SelectedAmp'
import { semaphoresPersistedReducer } from './SemaphoresSlice'

export const homeReducers = combineReducers({
  administrative: administrativeSlicePersistedReducer,
  draw: drawReducer,
  global: globalReducer,
  interestPoint: interestPointSlicePersistedReducer,
  map: mapSliceReducer,
  measurement: measurementSlicePersistedReducer,
  missionFilters: missionFiltersPersistedReducer,
  missionState: missionStateSliceReducer,
  multiMissions: multiMissionsSliceReducer,
  regulatory: regulatorySlicePersistedReducer,
  regulatoryLayerSearch: regulatoryLayerSearchSliceReducer,
  regulatoryMetadata: regulatoryMetadataSliceReducer,
  [layerSidebarSlice.name]: layerSidebarSlice.reducer,
  [ampsAPI.reducerPath]: ampsAPI.reducer,
  [regulatoryLayersAPI.reducerPath]: regulatoryLayersAPI.reducer,
  [regulatoryLayersAPI.reducerPath]: regulatoryLayersAPI.reducer,
  [missionsAPI.reducerPath]: missionsAPI.reducer,
  [controlThemesAPI.reducerPath]: controlThemesAPI.reducer,
  [controlUnitsAPI.reducerPath]: controlUnitsAPI.reducer,
  [infractionsAPI.reducerPath]: infractionsAPI.reducer,
  [semaphoresAPI.reducerPath]: semaphoresAPI.reducer,
  selectedAmp: selectedAmpSlicePersistedReducer,
  semaphoresSlice: semaphoresPersistedReducer,
  sideWindow: sideWindowReducer
})

export const homeMiddlewares = [
  ampsAPI.middleware,
  missionsAPI.middleware,
  regulatoryLayersAPI.middleware,
  controlThemesAPI.middleware,
  controlUnitsAPI.middleware,
  infractionsAPI.middleware,
  semaphoresAPI.middleware
]
