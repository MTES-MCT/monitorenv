import { LayersOverlay } from '@features/layersSelector/overlays'
import { LayerEvents } from '@features/layersSelector/overlays/LayerEvents'

import { BaseMap } from './BaseMap'
import { MapAttributionsBox } from './controls/MapAttributionsBox'
import { MapCoordinatesBox } from './controls/MapCoordinatesBox'
import { AdministrativeLayers } from './layers/AdministrativeLayers'
import { AMPLayers } from './layers/AMP'
import { AMPPreviewLayer } from './layers/AMP/AMPPreviewLayer'
import { DrawLayer } from './layers/DrawLayer'
import { MapLayer } from './layers/MapLayer'
import { MeasurementLayer } from './layers/MeasurementLayer'
import { MissionsLayer } from './layers/Missions'
import { EditingMissionLayer } from './layers/Missions/EditingMissionLayer'
import { HoveredMissionLayer } from './layers/Missions/HoveredMissionLayer'
import { SelectedMissionLayer } from './layers/Missions/SelectedMissionLayer'
import { RegulatoryLayers } from './layers/Regulatory'
import { RegulatoryPreviewLayer } from './layers/Regulatory/RegulatoryPreviewLayer'
import { SemaphoresLayer } from './layers/Semaphores'
import { MapExtentController } from './MapExtentController'
import { MapHistory } from './MapHistory'
import { ActionOverlay } from './overlays/actions'
import { MissionOverlays } from './overlays/missions'
import { SemaphoreOverlay } from './overlays/semaphores'
import { ZoomListener } from './ZoomListener'
import { InterestPointLayer } from '../InterestPoint/components/InterestPointLayer'
import { ReportingToAttachLayer } from '../missions/Layers/ReportingToAttach'
import { HoveredReportingToAttachLayer } from '../missions/Layers/ReportingToAttach/HoveredReportingToAttachLayer'
import { ReportingToAttachOverlays } from '../missions/Overlays/ReportingToAttach'
import { MissionToAttachLayer } from '../Reportings/Layers/MissionToAttach'
import { HoveredMissionToAttachLayer } from '../Reportings/Layers/MissionToAttach/HoveredMissionToAttachLayer'
import { SelectedMissionToAttachLayer } from '../Reportings/Layers/MissionToAttach/SelectedMissionToAttachLayer'
import { ReportingsLayer } from '../Reportings/Layers/Reporting'
import { EditingReportingLayer } from '../Reportings/Layers/Reporting/EditingReportingLayer'
import { HoveredReportingLayer } from '../Reportings/Layers/Reporting/HoveredReportingLayer'
import { SelectedReportingLayer } from '../Reportings/Layers/Reporting/SelectedReporting'
import { MissionToAttachOverlays } from '../Reportings/Overlays/MissionToAttach'
import { ReportingOverlay } from '../Reportings/Overlays/Reporting'
import { StationLayer } from '../Station/components/StationLayer'
import { StationOverlay } from '../Station/components/StationOverlay'

// TODO Either use HOC to get proprer typings inference or migrate to vanilla JS.
// https://legacy.reactjs.org/docs/higher-order-components.html#convention-pass-unrelated-props-through-to-the-wrapped-component
export function Map() {
  return (
    <BaseMap
    // BaseMap forwards map & mapClickEvent as props to children
    // handleMovingAndZoom={handleMovingAndZoom}
    // handlePointerMove={handlePointerMove}
    //
    // -> only add child to BaseMap if it requires map or mapClickEvent
    >
      {/* @ts-ignore */}
      <ZoomListener />
      {/* @ts-ignore */}
      <MapAttributionsBox />
      {/* @ts-ignore */}
      <MapCoordinatesBox />
      {/* @ts-ignore */}
      <MapLayer />

      {/* ZONE */}
      {/* @ts-ignore */}
      <AMPLayers />
      {/* @ts-ignore */}
      <AMPPreviewLayer />
      {/* @ts-ignore */}
      <RegulatoryLayers />
      {/* @ts-ignore */}
      <RegulatoryPreviewLayer />
      {/* @ts-ignore */}
      <AdministrativeLayers />
      {/* @ts-ignore */}
      <LayerEvents />
      {/* @ts-ignore */}
      <LayersOverlay />

      {/* MAP */}
      {/* @ts-ignore */}
      <MeasurementLayer />
      {/* @ts-ignore */}
      <InterestPointLayer />
      {/* @ts-ignore */}
      <MapExtentController />
      {/* @ts-ignore */}
      <MapHistory />
      {/* @ts-ignore */}
      <DrawLayer />

      {/* MISSION */}
      {/* @ts-ignore */}
      <MissionsLayer />
      {/* @ts-ignore */}
      <SelectedMissionLayer />
      {/* @ts-ignore */}
      <EditingMissionLayer />
      {/* @ts-ignore */}
      <HoveredMissionLayer />
      {/* @ts-ignore */}
      <MissionOverlays />
      {/* @ts-ignore */}
      <ActionOverlay />
      {/* @ts-ignore */}
      <ReportingToAttachLayer />
      {/* @ts-ignore */}
      <HoveredReportingToAttachLayer />
      {/* @ts-ignore */}
      <ReportingToAttachOverlays />

      {/* SEMAPHORE */}
      {/* @ts-ignore */}
      <SemaphoresLayer />
      {/* @ts-ignore */}
      <SemaphoreOverlay />

      {/* REPORTING */}
      {/* @ts-ignore */}
      <EditingReportingLayer />
      {/* @ts-ignore */}
      <SelectedReportingLayer />
      {/* @ts-ignore */}
      <HoveredReportingLayer />
      {/* @ts-ignore */}
      <ReportingsLayer />
      {/* @ts-ignore */}
      <ReportingOverlay />
      {/* @ts-ignore */}
      <StationLayer />
      {/* @ts-ignore */}
      <StationOverlay />
      {/* @ts-ignore */}
      <MissionToAttachLayer />
      {/* @ts-ignore */}
      <HoveredMissionToAttachLayer />
      {/* @ts-ignore */}
      <SelectedMissionToAttachLayer />
      {/* @ts-ignore */}
      <MissionToAttachOverlays />
    </BaseMap>
  )
}
