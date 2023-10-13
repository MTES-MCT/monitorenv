import { BaseMap } from './BaseMap'
import { MapAttributionsBox } from './controls/MapAttributionsBox'
import { MapCoordinatesBox } from './controls/MapCoordinatesBox'
import { AdministrativeLayers } from './layers/AdministrativeLayers'
import { AMPLayers } from './layers/AMP'
import { AMPPreviewLayer } from './layers/AMP/AMPPreviewLayer'
import { BaseLayer } from './layers/BaseLayer'
import { DrawLayer } from './layers/DrawLayer'
import { InterestPointLayer } from './layers/InterestPointLayer'
import { MeasurementLayer } from './layers/MeasurementLayer'
import { MissionsLayer } from './layers/Missions'
import { EditingMissionLayer } from './layers/Missions/EditingMissionLayer'
import { HoveredMissionLayer } from './layers/Missions/HoveredMissionLayer'
import { SelectedMissionLayer } from './layers/Missions/SelectedMissionLayer'
import { RegulatoryLayers } from './layers/Regulatory'
import { RegulatoryPreviewLayer } from './layers/Regulatory/RegulatoryPreviewLayer'
import { ReportingsLayer } from './layers/Reportings'
import { EditingReportingLayer } from './layers/Reportings/EditingReportingLayer'
import { HoveredReportingLayer } from './layers/Reportings/HoveredReportingLayer'
import { SelectedReportingLayer } from './layers/Reportings/SelectedReporting'
import { SemaphoresLayer } from './layers/Semaphores'
import { MapExtentController } from './MapExtentController'
import { MapHistory } from './MapHistory'
import { ActionOverlay } from './overlays/actions'
import { MissionOverlays } from './overlays/missions'
import { ReportingOverlay } from './overlays/reportings'
import { SemaphoreOverlay } from './overlays/semaphores'
import { ShowRegulatoryMetadata } from './ShowRegulatoryMetadata'
import { ReportingToAttachLayer } from '../missions/Layers/ReportingToAttach'
import { HoveredReportingToAttachLayer } from '../missions/Layers/ReportingToAttach/HoveredReportingToAttachLayer'
import { SelectedReportingToAttachLayer } from '../missions/Layers/ReportingToAttach/SelectedReportingToAttachLayer'
import { ReportingToAttachOverlays } from '../missions/Overlays/ReportingToAttachToMission'
import { MissionToAttachLayer } from '../Reportings/Layers/MissionToAttach'
import { HoveredMissionToAttachLayer } from '../Reportings/Layers/MissionToAttach/HoveredMissionToAttachLayer'
import { SelectedMissionToAttachLayer } from '../Reportings/Layers/MissionToAttach/SelectedMissionToAttachLayer'
import { MissionToAttachOverlays } from '../Reportings/Overlays/MissionToAttachToReporting'

export function Map() {
  return (
    <BaseMap
    // BaseMap forwards map & mapClickEvent as props to children
    // handleMovingAndZoom={handleMovingAndZoom}
    // handlePointerMove={handlePointerMove}
    //
    // -> only add child to BaseMap if it requires map or mapClickEvent
    >
      <MapAttributionsBox />
      <MapCoordinatesBox />
      <BaseLayer />

      {/* ZONE */}
      <AMPLayers />
      <AMPPreviewLayer />
      <RegulatoryLayers />
      <RegulatoryPreviewLayer />
      <ShowRegulatoryMetadata />
      <AdministrativeLayers />

      <MeasurementLayer />
      <InterestPointLayer />
      <MapExtentController />
      <MapHistory />
      <DrawLayer />

      {/* MISSION */}
      <MissionsLayer />
      <SelectedMissionLayer />
      <EditingMissionLayer />
      <HoveredMissionLayer />
      <MissionOverlays />
      <ActionOverlay />
      <ReportingToAttachLayer />
      <SelectedReportingToAttachLayer />
      <HoveredReportingToAttachLayer />
      <ReportingToAttachOverlays />

      {/* SEMAPHORE */}
      <SemaphoresLayer />
      <SemaphoreOverlay />

      {/* REPORTING */}
      <EditingReportingLayer />
      <SelectedReportingLayer />
      <HoveredReportingLayer />
      <ReportingsLayer />
      <ReportingOverlay />
      <MissionToAttachLayer />
      <HoveredMissionToAttachLayer />
      <SelectedMissionToAttachLayer />
      <MissionToAttachOverlays />
    </BaseMap>
  )
}
