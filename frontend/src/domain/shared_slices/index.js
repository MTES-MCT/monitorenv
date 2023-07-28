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
import { multiReportingsSliceReducer } from './MultiReportings'
import { regulatorySlicePersistedReducer } from './Regulatory'
import { regulatoryMetadataSliceReducer } from './RegulatoryMetadata'
import { reportingFiltersPersistedReducer } from './ReportingsFilters'
import { reportingStateSliceReducer } from './ReportingState'
import { selectedAmpSlicePersistedReducer } from './SelectedAmp'
import { semaphoresPersistedReducer } from './SemaphoresSlice'
import { ampsAPI, ampsErrorLoggerMiddleware } from '../../api/ampsAPI'
import { controlThemesAPI } from '../../api/controlThemesAPI'
import { controlUnitsAPI } from '../../api/controlUnitsAPI'
import { infractionsAPI } from '../../api/infractionsAPI'
import { missionsAPI } from '../../api/missionsAPI'
import { regulatoryLayersAPI } from '../../api/regulatoryLayersAPI'
import { reportingsAPI } from '../../api/reportingsAPI'
import { semaphoresAPI } from '../../api/semaphoresAPI'
import { layerSearchSliceReducer } from '../../features/layersSelector/search/LayerSearch.slice'
import { sideWindowReducer } from '../../features/SideWindow/slice'

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
  multiReportings: multiReportingsSliceReducer,
  regulatory: regulatorySlicePersistedReducer,
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
  reportingFilters: reportingFiltersPersistedReducer,
  reportingState: reportingStateSliceReducer,
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
