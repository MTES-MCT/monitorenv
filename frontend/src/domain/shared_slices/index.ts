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
import { legacyControlUnitsAPI } from '../../api/legacyControlUnitsAPI'
import { missionsAPI } from '../../api/missionsAPI'
import { regulatoryLayersAPI } from '../../api/regulatoryLayersAPI'
import { reportingsAPI } from '../../api/reportingsAPI'
import { semaphoresAPI } from '../../api/semaphoresAPI'
import { administrationTablePersistedReducer } from '../../features/Administration/components/AdministrationTable/slice'
import { backOfficeReducer } from '../../features/BackOffice/slice'
import { baseTablePersistedReducer } from '../../features/Base/components/BaseTable/slice'
import { controlUnitDialogReducer } from '../../features/ControlUnit/components/ControlUnitDialog/slice'
import { controlUnitListDialogPersistedReducer } from '../../features/ControlUnit/components/ControlUnitListDialog/slice'
import { controlUnitTablePersistedReducer } from '../../features/ControlUnit/components/ControlUnitTable/slice'
import { layerSearchSliceReducer } from '../../features/layersSelector/search/slice'
import { mainWindowReducer } from '../../features/MainWindow/slice'
import { attachMissionToReportingSliceReducer } from '../../features/Reportings/ReportingForm/AttachMission/slice'
import { sideWindowReducer } from '../../features/SideWindow/slice'

// TODO Maybe add a specifc store for the backoffice?
// But it won't be necessarily cleaner since current APIs are also needed in the home anyway.
export const homeReducers = combineReducers({
  [monitorenvPrivateApi.reducerPath]: monitorenvPrivateApi.reducer,
  [monitorenvPublicApi.reducerPath]: monitorenvPublicApi.reducer,
  administrative: administrativeSlicePersistedReducer,
  attachReportingToMission: attachMissionToReportingSliceReducer,
  backOffice: backOfficeReducer,
  backOfficeAdministrationList: administrationTablePersistedReducer,
  backOfficeBaseList: baseTablePersistedReducer,
  backOfficeControlUnitList: controlUnitTablePersistedReducer,
  draw: drawReducer,
  global: globalReducer,
  interestPoint: interestPointSlicePersistedReducer,
  layerSearch: layerSearchSliceReducer,
  mainWindow: mainWindowReducer,
  map: mapSliceReducer,
  mapControlUnitDialog: controlUnitDialogReducer,
  mapControlUnitListDialog: controlUnitListDialogPersistedReducer,
  measurement: measurementSlicePersistedReducer,
  missionFilters: missionFiltersPersistedReducer,
  missionState: missionStateSliceReducer,
  multiMissions: multiMissionsSliceReducer,
  regulatory: regulatorySlicePersistedReducer,
  regulatoryMetadata: regulatoryMetadataSliceReducer,
  [layerSidebarSlice.name]: layerSidebarSlice.reducer,
  [ampsAPI.reducerPath]: ampsAPI.reducer,
  [regulatoryLayersAPI.reducerPath]: regulatoryLayersAPI.reducer,
  [missionsAPI.reducerPath]: missionsAPI.reducer,
  [controlThemesAPI.reducerPath]: controlThemesAPI.reducer,
  [legacyControlUnitsAPI.reducerPath]: legacyControlUnitsAPI.reducer,
  [infractionsAPI.reducerPath]: infractionsAPI.reducer,
  [semaphoresAPI.reducerPath]: semaphoresAPI.reducer,
  reporting: reportingSliceReducer,
  [reportingsAPI.reducerPath]: reportingsAPI.reducer,
  reportingFilters: reportingFiltersPersistedReducer,
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
  legacyControlUnitsAPI.middleware,
  infractionsAPI.middleware,
  semaphoresAPI.middleware,
  reportingsAPI.middleware
]
