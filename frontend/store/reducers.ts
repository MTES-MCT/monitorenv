import { combineReducers } from '@reduxjs/toolkit'

import { ampsAPI, ampsErrorLoggerMiddleware } from '../src/api/ampsAPI'
import { controlThemesAPI } from '../src/api/controlThemesAPI'
import { controlUnitsAPI } from '../src/api/controlUnitsAPI'
import { infractionsAPI } from '../src/api/infractionsAPI'
import { missionsAPI } from '../src/api/missionsAPI'
import { regulatoryLayersAPI } from '../src/api/regulatoryLayersAPI'
import { reportingsAPI } from '../src/api/reportingsAPI'
import { semaphoresAPI } from '../src/api/semaphoresAPI'
import { administrativeSlicePersistedReducer } from '../src/domain/shared_slices/Administrative'
import { drawReducer } from '../src/domain/shared_slices/Draw'
import { globalReducer } from '../src/domain/shared_slices/Global'
import { interestPointSlicePersistedReducer } from '../src/domain/shared_slices/InterestPoint'
import { layerSidebarSlice } from '../src/domain/shared_slices/LayerSidebar'
import { mapSliceReducer } from '../src/domain/shared_slices/Map'
import { measurementSlicePersistedReducer } from '../src/domain/shared_slices/Measurement'
import { missionFiltersPersistedReducer } from '../src/domain/shared_slices/MissionFilters'
import { missionStateSliceReducer } from '../src/domain/shared_slices/MissionsState'
import { multiMissionsSliceReducer } from '../src/domain/shared_slices/MultiMissions'
import { regulatorySlicePersistedReducer } from '../src/domain/shared_slices/Regulatory'
import { regulatoryMetadataSliceReducer } from '../src/domain/shared_slices/RegulatoryMetadata'
import { reportingSliceReducer } from '../src/domain/shared_slices/reporting'
import { reportingFiltersPersistedReducer } from '../src/domain/shared_slices/ReportingsFilters'
import { selectedAmpSlicePersistedReducer } from '../src/domain/shared_slices/SelectedAmp'
import { semaphoresPersistedReducer } from '../src/domain/shared_slices/SemaphoresSlice'
import { layerSearchSliceReducer } from '../src/features/layersSelector/search/LayerSearch.slice'
import { sideWindowReducer } from '../src/features/SideWindow/slice'

export const homeReducers = combineReducers({
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
  [controlUnitsAPI.reducerPath]: controlUnitsAPI.reducer,
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
  controlUnitsAPI.middleware,
  infractionsAPI.middleware,
  semaphoresAPI.middleware,
  reportingsAPI.middleware
]
