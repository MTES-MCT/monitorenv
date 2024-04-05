import { geoserverApi, monitorenvPrivateApi, monitorenvPublicApi } from '../api/api'
import { administrativeSlicePersistedReducer } from '../domain/shared_slices/Administrative'
import { ampSlicePersistedReducer } from '../domain/shared_slices/Amp'
import { drawReducer } from '../domain/shared_slices/Draw'
import { globalReducer } from '../domain/shared_slices/Global'
import { interestPointSlicePersistedReducer } from '../domain/shared_slices/InterestPoint'
import { layerSidebarSlice } from '../domain/shared_slices/LayerSidebar'
import { mapSliceReducer } from '../domain/shared_slices/Map'
import { measurementSlicePersistedReducer } from '../domain/shared_slices/Measurement'
import { missionFiltersPersistedReducer } from '../domain/shared_slices/MissionFilters'
import { regulatorySlicePersistedReducer } from '../domain/shared_slices/Regulatory'
import { reportingSliceReducer } from '../domain/shared_slices/reporting'
import { reportingFiltersPersistedReducer } from '../domain/shared_slices/ReportingsFilters'
import { semaphoresPersistedReducer } from '../domain/shared_slices/SemaphoresSlice'
import { administrationTablePersistedReducer } from '../features/Administration/components/AdministrationTable/slice'
import { backOfficeReducer } from '../features/BackOffice/slice'
import { controlUnitDialogReducer } from '../features/ControlUnit/components/ControlUnitDialog/slice'
import { controlUnitListDialogPersistedReducer } from '../features/ControlUnit/components/ControlUnitListDialog/slice'
import { controlUnitTablePersistedReducer } from '../features/ControlUnit/components/ControlUnitTable/slice'
import { metadataPanelSliceReducer } from '../features/layersSelector/metadataPanel/slice'
import { layerSearchSliceReducer } from '../features/layersSelector/search/slice'
import { mainWindowReducer } from '../features/MainWindow/slice'
import { attachReportingToMissionsSliceReducer } from '../features/missions/MissionForm/AttachReporting/slice'
import { missionFormsSliceReducer } from '../features/missions/MissionForm/slice'
import { missionSliceReducer } from '../features/missions/slice'
import { attachMissionToReportingSliceReducer } from '../features/Reportings/slice'
import { sideWindowReducer } from '../features/SideWindow/slice'
import { stationTablePersistedReducer } from '../features/Station/components/StationTable/slice'
import { stationReducer } from '../features/Station/slice'

// TODO Maybe add a specifc store for the backoffice (to make it lighter)?
export const homeReducers = {
  [geoserverApi.reducerPath]: geoserverApi.reducer,
  [monitorenvPrivateApi.reducerPath]: monitorenvPrivateApi.reducer,
  [monitorenvPublicApi.reducerPath]: monitorenvPublicApi.reducer,
  administrationTable: administrationTablePersistedReducer,
  administrative: administrativeSlicePersistedReducer,
  amp: ampSlicePersistedReducer,
  attachMissionToReporting: attachMissionToReportingSliceReducer,
  attachReportingToMission: attachReportingToMissionsSliceReducer,
  backOffice: backOfficeReducer,
  controlUnitTable: controlUnitTablePersistedReducer,
  draw: drawReducer,
  global: globalReducer,
  interestPoint: interestPointSlicePersistedReducer,
  layerSearch: layerSearchSliceReducer,
  mainWindow: mainWindowReducer,
  map: mapSliceReducer,
  mapControlUnitDialog: controlUnitDialogReducer,
  mapControlUnitListDialog: controlUnitListDialogPersistedReducer,
  measurement: measurementSlicePersistedReducer,
  metadataPanel: metadataPanelSliceReducer,
  mission: missionSliceReducer,
  missionFilters: missionFiltersPersistedReducer,
  missionForms: missionFormsSliceReducer,
  [layerSidebarSlice.name]: layerSidebarSlice.reducer,
  regulatory: regulatorySlicePersistedReducer,
  reporting: reportingSliceReducer,
  reportingFilters: reportingFiltersPersistedReducer,
  semaphoresSlice: semaphoresPersistedReducer,
  sideWindow: sideWindowReducer,
  station: stationReducer,
  stationTable: stationTablePersistedReducer
}
