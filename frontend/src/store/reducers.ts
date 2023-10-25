import { ampsAPI } from '../api/ampsAPI'
import { geoserverApi, monitorenvPrivateApi, monitorenvPublicApi } from '../api/api'
import { controlThemesAPI } from '../api/controlThemesAPI'
import { infractionsAPI } from '../api/infractionsAPI'
import { legacyControlUnitsAPI } from '../api/legacyControlUnitsAPI'
import { missionsAPI } from '../api/missionsAPI'
import { regulatoryLayersAPI } from '../api/regulatoryLayersAPI'
import { reportingsAPI } from '../api/reportingsAPI'
import { semaphoresAPI } from '../api/semaphoresAPI'
import { administrativeSlicePersistedReducer } from '../domain/shared_slices/Administrative'
import { drawReducer } from '../domain/shared_slices/Draw'
import { globalReducer } from '../domain/shared_slices/Global'
import { interestPointSlicePersistedReducer } from '../domain/shared_slices/InterestPoint'
import { layerSidebarSlice } from '../domain/shared_slices/LayerSidebar'
import { mapSliceReducer } from '../domain/shared_slices/Map'
import { measurementSlicePersistedReducer } from '../domain/shared_slices/Measurement'
import { missionFiltersPersistedReducer } from '../domain/shared_slices/MissionFilters'
import { missionStateSliceReducer } from '../domain/shared_slices/MissionsState'
import { multiMissionsSliceReducer } from '../domain/shared_slices/MultiMissions'
import { regulatorySlicePersistedReducer } from '../domain/shared_slices/Regulatory'
import { regulatoryMetadataSliceReducer } from '../domain/shared_slices/RegulatoryMetadata'
import { reportingSliceReducer } from '../domain/shared_slices/reporting'
import { reportingFiltersPersistedReducer } from '../domain/shared_slices/ReportingsFilters'
import { selectedAmpSlicePersistedReducer } from '../domain/shared_slices/SelectedAmp'
import { semaphoresPersistedReducer } from '../domain/shared_slices/SemaphoresSlice'
import { administrationTablePersistedReducer } from '../features/Administration/components/AdministrationTable/slice'
import { backOfficeReducer } from '../features/BackOffice/slice'
import { baseTablePersistedReducer } from '../features/Base/components/BaseTable/slice'
import { controlUnitDialogReducer } from '../features/ControlUnit/components/ControlUnitDialog/slice'
import { controlUnitListDialogPersistedReducer } from '../features/ControlUnit/components/ControlUnitListDialog/slice'
import { controlUnitTablePersistedReducer } from '../features/ControlUnit/components/ControlUnitTable/slice'
import { layerSearchSliceReducer } from '../features/layersSelector/search/slice'
import { mainWindowReducer } from '../features/MainWindow/slice'
import { sideWindowReducer } from '../features/SideWindow/slice'

// TODO Maybe add a specifc store for the backoffice (to make it lighter)?
export const homeReducers = {
  [geoserverApi.reducerPath]: geoserverApi.reducer,
  [monitorenvPrivateApi.reducerPath]: monitorenvPrivateApi.reducer,
  [monitorenvPublicApi.reducerPath]: monitorenvPublicApi.reducer,

  administrative: administrativeSlicePersistedReducer,
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
  reporting: reportingSliceReducer,
  [layerSidebarSlice.name]: layerSidebarSlice.reducer,
  [ampsAPI.reducerPath]: ampsAPI.reducer,
  [regulatoryLayersAPI.reducerPath]: regulatoryLayersAPI.reducer,
  [missionsAPI.reducerPath]: missionsAPI.reducer,
  [controlThemesAPI.reducerPath]: controlThemesAPI.reducer,
  [legacyControlUnitsAPI.reducerPath]: legacyControlUnitsAPI.reducer,
  [infractionsAPI.reducerPath]: infractionsAPI.reducer,
  [semaphoresAPI.reducerPath]: semaphoresAPI.reducer,
  reportingFilters: reportingFiltersPersistedReducer,
  [reportingsAPI.reducerPath]: reportingsAPI.reducer,
  selectedAmp: selectedAmpSlicePersistedReducer,
  semaphoresSlice: semaphoresPersistedReducer,
  sideWindow: sideWindowReducer
}
