import { accountSliceReducer } from '@features/Account/slice'
import { dashboardFiltersPersistedReducer } from '@features/Dashboard/components/DashboardForm/slice'
import { dashboardReducer } from '@features/Dashboard/slice'
import { interestPointSlicePersistedReducer } from '@features/InterestPoint/slice'
import { localizedAreaSlicePersistedReducer } from '@features/LocalizedArea/slice'
import { recentActivityPersitedReducer } from '@features/RecentActivity/slice'
import { regulatoryAreaTablePersistedReducer } from '@features/RegulatoryArea/components/RegulatoryAreaList/slice'
import { regulatoryAreaBoReducer } from '@features/RegulatoryArea/slice'
import { attachMissionToReportingSliceReducer } from '@features/Reportings/components/ReportingForm/AttachMission/slice'
import { reportingFiltersPersistedReducer } from '@features/Reportings/Filters/slice'
import { reportingSliceReducer } from '@features/Reportings/slice'
import { vesselReducer } from '@features/Vessel/slice'
import { vigilanceAreaFiltersPersistedReducer } from '@features/VigilanceArea/components/VigilanceAreasList/Filters/slice'
import { vigilanceAreaPersistedReducer } from '@features/VigilanceArea/slice'

import { monitorenvPrivateApi, monitorenvPublicApi } from '../api/api'
import { administrativeSlicePersistedReducer } from '../domain/shared_slices/Administrative'
import { ampSlicePersistedReducer } from '../domain/shared_slices/Amp'
import { drawReducer } from '../domain/shared_slices/Draw'
import { globalReducer } from '../domain/shared_slices/Global'
import { layerSidebarSlice } from '../domain/shared_slices/LayerSidebar'
import { mapSliceReducer } from '../domain/shared_slices/Map'
import { measurementSlicePersistedReducer } from '../domain/shared_slices/Measurement'
import { missionFiltersPersistedReducer } from '../domain/shared_slices/MissionFilters'
import { regulatorySlicePersistedReducer } from '../domain/shared_slices/Regulatory'
import { semaphoresPersistedReducer } from '../domain/shared_slices/SemaphoresSlice'
import { administrationTablePersistedReducer } from '../features/Administration/components/AdministrationTable/slice'
import { backOfficeReducer } from '../features/BackOffice/slice'
import { controlUnitDialogReducer } from '../features/ControlUnit/components/ControlUnitDialog/slice'
import { controlUnitListDialogPersistedReducer } from '../features/ControlUnit/components/ControlUnitListDialog/slice'
import { controlUnitTablePersistedReducer } from '../features/ControlUnit/components/ControlUnitTable/slice'
import { layersMetadataSliceReducer } from '../features/layersSelector/metadataPanel/slice'
import { layerSearchSliceReducer } from '../features/layersSelector/search/slice'
import { mainWindowReducer } from '../features/MainWindow/slice'
import { attachReportingToMissionsSliceReducer } from '../features/Mission/components/MissionForm/AttachReporting/slice'
import { missionFormsSliceReducer } from '../features/Mission/components/MissionForm/slice'
import { missionSliceReducer } from '../features/Mission/slice'
import { sideWindowReducer } from '../features/SideWindow/slice'
import { stationTablePersistedReducer } from '../features/Station/components/StationTable/slice'
import { stationReducer } from '../features/Station/slice'

// TODO Maybe add a specifc store for the backoffice (to make it lighter)?
export const homeReducers = {
  [monitorenvPrivateApi.reducerPath]: monitorenvPrivateApi.reducer,
  [monitorenvPublicApi.reducerPath]: monitorenvPublicApi.reducer,
  account: accountSliceReducer,
  administrationTable: administrationTablePersistedReducer,
  administrative: administrativeSlicePersistedReducer,
  amp: ampSlicePersistedReducer,
  attachMissionToReporting: attachMissionToReportingSliceReducer,
  attachReportingToMission: attachReportingToMissionsSliceReducer,
  backOffice: backOfficeReducer,
  controlUnitTable: controlUnitTablePersistedReducer,
  dashboard: dashboardReducer,
  dashboardFilters: dashboardFiltersPersistedReducer,
  draw: drawReducer,
  global: globalReducer,
  interestPoint: interestPointSlicePersistedReducer,
  layerSearch: layerSearchSliceReducer,
  layersMetadata: layersMetadataSliceReducer,
  localizedArea: localizedAreaSlicePersistedReducer,
  mainWindow: mainWindowReducer,
  map: mapSliceReducer,
  mapControlUnitDialog: controlUnitDialogReducer,
  mapControlUnitListDialog: controlUnitListDialogPersistedReducer,
  measurement: measurementSlicePersistedReducer,
  mission: missionSliceReducer,
  [layerSidebarSlice.name]: layerSidebarSlice.reducer,
  missionFilters: missionFiltersPersistedReducer,
  missionForms: missionFormsSliceReducer,
  recentActivity: recentActivityPersitedReducer,
  regulatory: regulatorySlicePersistedReducer,
  regulatoryAreaBo: regulatoryAreaBoReducer,
  regulatoryAreaTable: regulatoryAreaTablePersistedReducer,
  reporting: reportingSliceReducer,
  reportingFilters: reportingFiltersPersistedReducer,
  semaphoresSlice: semaphoresPersistedReducer,
  sideWindow: sideWindowReducer,
  station: stationReducer,
  stationTable: stationTablePersistedReducer,
  vessel: vesselReducer,
  vigilanceArea: vigilanceAreaPersistedReducer,
  vigilanceAreaFilters: vigilanceAreaFiltersPersistedReducer
}
