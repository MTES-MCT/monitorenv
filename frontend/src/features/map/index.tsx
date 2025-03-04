import { ActiveDashboardLayer } from '@features/Dashboard/components/Layers/ActiveDashboardLayer'
import { DashboardsLayer } from '@features/Dashboard/components/Layers/DashboardsLayer'
import { DrawDashboardLayer } from '@features/Dashboard/components/Layers/DrawDashboardLayer'
import { DashboardPreviewLayer } from '@features/Dashboard/components/Layers/PreviewDashboardLayer'
import { DashboardReportingOverlay } from '@features/Dashboard/components/Layers/ReportingOverlay'
import { SelectedDashboardLayer } from '@features/Dashboard/components/Layers/SelectedDashboardLayer'
import { LayersOverlay } from '@features/layersSelector/overlays'
import { LayerEvents } from '@features/layersSelector/overlays/LayerEvents'
import { MissionsLayer } from '@features/Mission/components/Layers'
import { EditingMissionLayer } from '@features/Mission/components/Layers/EditingMissionLayer'
import { HoveredMissionLayer } from '@features/Mission/components/Layers/HoveredMissionLayer'
import { ReportingToAttachLayer } from '@features/Mission/components/Layers/ReportingToAttach'
import { HoveredReportingToAttachLayer } from '@features/Mission/components/Layers/ReportingToAttach/HoveredReportingToAttachLayer'
import { SelectedMissionLayer } from '@features/Mission/components/Layers/SelectedMissionLayer'
import { MissionOverlays } from '@features/Mission/components/Overlays'
import { ReportingToAttachOverlays } from '@features/Mission/components/Overlays/ReportingToAttach'
import { RecentControlsActivityLayer } from '@features/RecentActivity/components/Layers/RecentControlsActivityLayer'
import { RecentControlActivityOverlay } from '@features/RecentActivity/components/Overlays/RecentControlActivityOverlay'
import { VigilanceAreasLayer } from '@features/VigilanceArea/components/VigilanceAreaLayer'
import { DrawVigilanceAreaLayer } from '@features/VigilanceArea/components/VigilanceAreaLayer/DrawVigilanceAreaLayer'
import { EditingVigilanceAreaLayer } from '@features/VigilanceArea/components/VigilanceAreaLayer/EditingVigilanceAreaLayer'
import { PreviewVigilanceAreasLayer } from '@features/VigilanceArea/components/VigilanceAreaLayer/PreviewVigilanceAreasLayer'
import { SelectedVigilanceAreaLayer } from '@features/VigilanceArea/components/VigilanceAreaLayer/SelectedVigilanceAreaLayer'

import { BaseMap } from './BaseMap'
import { MapAttributionsBox } from './controls/MapAttributionsBox'
import { MapCoordinatesBox } from './controls/MapCoordinatesBox'
import { AdministrativeLayers } from './layers/AdministrativeLayers'
import { AMPLayers } from './layers/AMP'
import { ZoomListener } from './ZoomListener'
import { DashboardOverlay } from '../Dashboard/components/Overlays/DashboardOverlay'
import { InterestPointLayer } from '../InterestPoint/components/InterestPointLayer'
import { MissionToAttachLayer } from '../Reportings/components/ReportingLayer/MissionToAttach'
import { HoveredMissionToAttachLayer } from '../Reportings/components/ReportingLayer/MissionToAttach/HoveredMissionToAttachLayer'
import { SelectedMissionToAttachLayer } from '../Reportings/components/ReportingLayer/MissionToAttach/SelectedMissionToAttachLayer'
import { ReportingsLayer } from '../Reportings/components/ReportingLayer/Reporting'
import { EditingReportingLayer } from '../Reportings/components/ReportingLayer/Reporting/EditingReportingLayer'
import { HoveredReportingLayer } from '../Reportings/components/ReportingLayer/Reporting/HoveredReportingLayer'
import { SelectedReportingLayer } from '../Reportings/components/ReportingLayer/Reporting/SelectedReporting'
import { MissionToAttachOverlays } from '../Reportings/components/ReportingOverlay/MissionToAttach'
import { ReportingOverlay } from '../Reportings/components/ReportingOverlay/Reporting'
import { SemaphoresLayer } from '../Semaphore/components/Layer'
import { HoveredSemaphoreLayer } from '../Semaphore/components/Layer/HoveredSemaphoreLayer'
import { SelectedSemaphoreLayer } from '../Semaphore/components/Layer/SelectedSemaphoreLayer'
import { SemaphoreOverlay } from '../Semaphore/components/Overlay'
import { StationLayer } from '../Station/components/StationLayer'
import { StationOverlay } from '../Station/components/StationOverlay'
import { AMPPreviewLayer } from './layers/AMP/AMPPreviewLayer'
import { DrawLayer } from './layers/DrawLayer'
import { MapLayer } from './layers/MapLayer'
import { MeasurementLayer } from './layers/MeasurementLayer'
import { RegulatoryLayers } from './layers/Regulatory'
import { RegulatoryPreviewLayer } from './layers/Regulatory/RegulatoryPreviewLayer'
import { SearchExtentLayer } from './layers/SearchExtentLayer'
import { MapExtentController } from './MapExtentController'
import { MapHistory } from './MapHistory'
import { ActionOverlay } from './overlays/actions'

// TODO Either use HOC to get proprer typings inference or migrate to vanilla JS.
// https://legacy.reactjs.org/docs/higher-order-components.html#convention-pass-unrelated-props-through-to-the-wrapped-component
export function Map({ isSuperUser }) {
  if (!isSuperUser) {
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
        <SearchExtentLayer />
        {/* @ts-ignore */}
        <LayerEvents />
        {/* @ts-ignore */}
        <LayersOverlay />

        {/* MAP */}
        {/* @ts-ignore */}
        <MapExtentController />
        {/* @ts-ignore */}
        <MapHistory />

        {/* SEMAPHORE */}
        {/* @ts-ignore */}
        <SemaphoresLayer />
        {/* @ts-ignore */}
        <SemaphoreOverlay isSuperUser={false} />
      </BaseMap>
    )
  }

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
      <SearchExtentLayer />
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
      <HoveredSemaphoreLayer />
      {/* @ts-ignore */}
      <SelectedSemaphoreLayer />
      {/* @ts-ignore */}
      <SemaphoreOverlay isSuperUser />

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
      <MissionToAttachLayer />
      {/* @ts-ignore */}
      <HoveredMissionToAttachLayer />
      {/* @ts-ignore */}
      <SelectedMissionToAttachLayer />
      {/* @ts-ignore */}
      <MissionToAttachOverlays />

      {/* STATION */}
      {/* @ts-ignore */}
      <StationLayer />
      {/* @ts-ignore */}
      <StationOverlay />

      {/* VIGILANCE AREA */}
      {/* @ts-ignore */}
      <VigilanceAreasLayer />
      {/* @ts-ignore */}
      <PreviewVigilanceAreasLayer />
      {/* @ts-ignore */}
      <DrawVigilanceAreaLayer />
      {/* @ts-ignore */}
      <SelectedVigilanceAreaLayer />
      {/* @ts-ignore */}
      <EditingVigilanceAreaLayer />

      {/* DASHBOARD */}
      {/* @ts-ignore */}
      <DrawDashboardLayer />
      {/* @ts-ignore */}
      <ActiveDashboardLayer />
      {/* @ts-ignore */}
      <DashboardPreviewLayer />
      {/* @ts-ignore */}
      <DashboardReportingOverlay />
      {/* @ts-ignore */}
      <DashboardOverlay />
      {/* @ts-ignore */}
      <DashboardsLayer />
      {/* @ts-ignore */}
      <SelectedDashboardLayer />

      {/* RECENT ACTIVITY */}
      {/* @ts-ignore */}
      <RecentControlsActivityLayer />
      {/* @ts-ignore */}
      <RecentControlActivityOverlay />
    </BaseMap>
  )
}
