// TODO We should move that into `/frontend/src/store` directory.

import { combineReducers } from '@reduxjs/toolkit'

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
import { reportingSliceReducer } from './reporting'
import { reportingFiltersPersistedReducer } from './ReportingsFilters'
import { selectedAmpSlicePersistedReducer } from './SelectedAmp'
import { semaphoresPersistedReducer } from './SemaphoresSlice'
import { ampsAPI, ampsErrorLoggerMiddleware } from '../../api/ampsAPI'
import { monitorenvPrivateApi, monitorenvPublicApi } from '../../api/api'
import { controlThemesAPI } from '../../api/controlThemesAPI'
import { infractionsAPI } from '../../api/infractionsAPI'
import { legacyControlUnit } from '../../api/legacyControlUnit'
import { missionsAPI } from '../../api/missionsAPI'
import { regulatoryLayersAPI } from '../../api/regulatoryLayersAPI'
import { reportingsAPI } from '../../api/reportingsAPI'
import { semaphoresAPI } from '../../api/semaphoresAPI'
import { layerSearchSliceReducer } from '../../features/layersSelector/search/LayerSearch.slice'
import { sideWindowReducer } from '../../features/SideWindow/slice'

// TODO Maybe add a specifc store for the backoffice?
// But it won't be necessarily cleaner since current APIs are also needed in the home anyway.
export const homeReducers = combineReducers({
  [monitorenvPrivateApi.reducerPath]: monitorenvPrivateApi.reducer,
  [monitorenvPublicApi.reducerPath]: monitorenvPublicApi.reducer,

  administrative: administrativeSlicePersistedReducer,
  draw: drawReducer,
  global: globalReducer,
  interestPoint: interestPointSlicePersistedReducer,
  layerSearch: layerSearchSliceReducer,
  map: mapSliceReducer,
  measurement: measurementSlicePersistedReducer,
  missionFilters: missionFiltersPersistedReducer,
  missionState: missionStateSliceReducer,
  multiMissions: multiMissionsSliceReducer,
  regulatory: regulatorySlicePersistedReducer,
  regulatoryMetadata: regulatoryMetadataSliceReducer,
  reporting: reportingSliceReducer,
  [layerSidebarSlice.name]: layerSidebarSlice.reducer,
  [ampsAPI.reducerPath]: ampsAPI.reducer,
  [regulatoryLayersAPI.reducerPath]: regulatoryLayersAPI.reducer,
  [missionsAPI.reducerPath]: missionsAPI.reducer,
  [controlThemesAPI.reducerPath]: controlThemesAPI.reducer,
  [legacyControlUnit.reducerPath]: legacyControlUnit.reducer,
  [infractionsAPI.reducerPath]: infractionsAPI.reducer,
  [semaphoresAPI.reducerPath]: semaphoresAPI.reducer,
  reportingFilters: reportingFiltersPersistedReducer,
  [reportingsAPI.reducerPath]: reportingsAPI.reducer,
  selectedAmp: selectedAmpSlicePersistedReducer,
  semaphoresSlice: semaphoresPersistedReducer,
  sideWindow: sideWindowReducer
})

export const homeMiddlewares = [
  ampsAPI.middleware,
  ampsErrorLoggerMiddleware,
  missionsAPI.middleware,
  regulatoryLayersAPI.middleware,
  controlThemesAPI.middleware,
  legacyControlUnit.middleware,
  infractionsAPI.middleware,
  semaphoresAPI.middleware,
  reportingsAPI.middleware
]
