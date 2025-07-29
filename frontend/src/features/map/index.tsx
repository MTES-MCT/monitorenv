import { ActiveDashboardLayer } from '@features/Dashboard/components/Layers/ActiveDashboardLayer'
import { DashboardRecentActivityLayer } from '@features/Dashboard/components/Layers/DashboardRecentActivityLayer'
import { DashboardsLayer } from '@features/Dashboard/components/Layers/DashboardsLayer'
import { DrawDashboardLayer } from '@features/Dashboard/components/Layers/DrawDashboardLayer'
import { DashboardPreviewLayer } from '@features/Dashboard/components/Layers/PreviewDashboardLayer'
import { DashboardReportingOverlay } from '@features/Dashboard/components/Layers/ReportingOverlay'
import { SelectedDashboardLayer } from '@features/Dashboard/components/Layers/SelectedDashboardLayer'
import { LayersOverlay } from '@features/layersSelector/overlays'
import { LayerEvents } from '@features/layersSelector/overlays/LayerEvents'
import { LocalizedAreasLayer } from '@features/LocalizedArea/components/Layers'
import { MissionsLayer } from '@features/Mission/components/Layers'
import { EditingMissionLayer } from '@features/Mission/components/Layers/EditingMissionLayer'
import { HoveredMissionLayer } from '@features/Mission/components/Layers/HoveredMissionLayer'
import { ReportingToAttachLayer } from '@features/Mission/components/Layers/ReportingToAttach'
import { HoveredReportingToAttachLayer } from '@features/Mission/components/Layers/ReportingToAttach/HoveredReportingToAttachLayer'
import { SelectedMissionLayer } from '@features/Mission/components/Layers/SelectedMissionLayer'
import { MissionOverlays } from '@features/Mission/components/Overlays'
import { ReportingToAttachOverlays } from '@features/Mission/components/Overlays/ReportingToAttach'
import { DrawRecentActivityLayer } from '@features/RecentActivity/components/Layers/DrawRecentActivityLayer'
import { RecentActivityLayerEvents } from '@features/RecentActivity/components/Layers/RecentActivityLayerEvents'
import { RecentControlsActivityLayer } from '@features/RecentActivity/components/Layers/RecentControlsActivityLayer'
import { RecentActvityOverlay } from '@features/RecentActivity/components/Overlays'
import { RecentActivityLegend } from '@features/RecentActivity/components/RecentActivityLegend'
import { VigilanceAreasLayer } from '@features/VigilanceArea/components/VigilanceAreaLayer'
import { DrawVigilanceAreaLayer } from '@features/VigilanceArea/components/VigilanceAreaLayer/DrawVigilanceAreaLayer'
import { EditingVigilanceAreaLayer } from '@features/VigilanceArea/components/VigilanceAreaLayer/EditingVigilanceAreaLayer'
import { PreviewVigilanceAreasLayer } from '@features/VigilanceArea/components/VigilanceAreaLayer/PreviewVigilanceAreasLayer'
import { SelectedVigilanceAreaLayer } from '@features/VigilanceArea/components/VigilanceAreaLayer/SelectedVigilanceAreaLayer'
import { useAppSelector } from '@hooks/useAppSelector'

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
export function Map() {
  const displayRecentActivityLayer = useAppSelector(state => state.global.layers.displayRecentActivityLayer)
  const isRecentActivityDialogVisible = useAppSelector(state => state.global.visibility.isRecentActivityDialogVisible)
  const activeDashboardId = useAppSelector(state => state.dashboard.activeDashboardId)
  const isSuperUser = useAppSelector(state => state.account.isSuperUser)

  const displayRecentActivityLegend =
    (displayRecentActivityLayer || !!activeDashboardId) && !isRecentActivityDialogVisible

  const baseChildren = [
    // @ts-ignore
    <ZoomListener key="ZoomListener" />,
    // @ts-ignore
    <MapAttributionsBox key="MapAttributionsBox" />,
    // @ts-ignore
    <MapCoordinatesBox key="MapCoordinatesBox" />,
    // @ts-ignore
    <MapLayer key="MapLayer" />,

    // ZONE
    // @ts-ignore
    <AMPLayers key="AMPLayers" />,
    // @ts-ignore
    <AMPPreviewLayer key="AMPPreviewLayer" />,
    // @ts-ignore
    <RegulatoryLayers key="RegulatoryLayers" />,
    // @ts-ignore
    <RegulatoryPreviewLayer key="RegulatoryPreviewLayer" />,
    // @ts-ignore
    <AdministrativeLayers key="AdministrativeLayers" />,
    // @ts-ignore
    <SearchExtentLayer key="SearchExtentLayer" />,
    // @ts-ignore
    <LayerEvents key="LayerEvents" />,
    // @ts-ignore
    <LayersOverlay key="LayersOverlay" />,

    // MAP
    // @ts-ignore
    <MapExtentController key="MapExtentController" />,
    // @ts-ignore
    <MapHistory key="MapHistory" />,

    // SEMAPHORE
    // @ts-ignore
    <SemaphoresLayer key="SemaphoresLayer" />,
    // @ts-ignore
    <SemaphoreOverlay key="SemaphoreOverlay" />,

    // REPORTING
    // @ts-ignore
    <EditingReportingLayer key="EditingReportingLayer" />,
    // @ts-ignore
    <SelectedReportingLayer key="SelectedReportingLayer" />,
    // @ts-ignore
    <HoveredReportingLayer key="HoveredReportingLayer" />,
    // @ts-ignore
    <ReportingsLayer key="ReportingsLayer" />,
    // @ts-ignore
    <ReportingOverlay key="ReportingOverlay" />,

    // VIGILANCE AREA
    // @ts-ignore
    <VigilanceAreasLayer key="VigilanceAreasLayer" />,
    // @ts-ignore
    <PreviewVigilanceAreasLayer key="PreviewVigilanceAreasLayer" />,
    // @ts-ignore
    <SelectedVigilanceAreaLayer key="SelectedVigilanceAreaLayer" />,

    // RECENT ACTIVITY
    // @ts-ignore
    <RecentControlsActivityLayer key="RecentControlsActivityLayer" />,
    // @ts-ignore
    <DrawRecentActivityLayer key="DrawRecentActivityLayer" />,
    // @ts-ignore
    <RecentActivityLayerEvents key="RecentActivityLayerEvents" />,
    // @ts-ignore
    <RecentActvityOverlay key="RecentActvityOverlay" />,
    // @ts-ignore
    displayRecentActivityLegend ? <RecentActivityLegend key="RecentActivityLegend" location="OUTSIDE" /> : null,

    // LOCALIZED AREAS
    // @ts-ignore
    <LocalizedAreasLayer key="LocalizedAreasLayer" />
  ]

  const superUserChildren = isSuperUser
    ? [
        // @ts-ignore
        <MeasurementLayer key="MeasurementLayer" />,
        // @ts-ignore
        <InterestPointLayer key="InterestPointLayer" />,
        // @ts-ignore
        <DrawLayer key="DrawLayer" />,
        // @ts-ignore
        <MissionsLayer key="MissionsLayer" />,
        // @ts-ignore
        <SelectedMissionLayer key="SelectedMissionLayer" />,
        // @ts-ignore
        <EditingMissionLayer key="EditingMissionLayer" />,
        // @ts-ignore
        <HoveredMissionLayer key="HoveredMissionLayer" />,
        // @ts-ignore
        <MissionOverlays key="MissionOverlays" />,
        // @ts-ignore
        <ActionOverlay key="ActionOverlay" />,
        // @ts-ignore
        <ReportingToAttachLayer key="ReportingToAttachLayer" />,
        // @ts-ignore
        <HoveredReportingToAttachLayer key="HoveredReportingToAttachLayer" />,
        // @ts-ignore
        <ReportingToAttachOverlays key="ReportingToAttachOverlays" />,
        // @ts-ignore
        <HoveredSemaphoreLayer key="HoveredSemaphoreLayer" />,
        // @ts-ignore
        <SelectedSemaphoreLayer key="SelectedSemaphoreLayer" />,
        // @ts-ignore
        <MissionToAttachLayer key="MissionToAttachLayer" />,
        // @ts-ignore
        <HoveredMissionToAttachLayer key="HoveredMissionToAttachLayer" />,
        // @ts-ignore
        <SelectedMissionToAttachLayer key="SelectedMissionToAttachLayer" />,
        // @ts-ignore
        <MissionToAttachOverlays key="MissionToAttachOverlays" />,
        // @ts-ignore
        <StationLayer key="StationLayer" />,
        // @ts-ignore
        <StationOverlay key="StationOverlay" />,
        // @ts-ignore
        <DrawVigilanceAreaLayer key="DrawVigilanceAreaLayer" />,
        // @ts-ignore
        <EditingVigilanceAreaLayer key="EditingVigilanceAreaLayer" />,
        // @ts-ignore
        <DrawDashboardLayer key="DrawDashboardLayer" />,
        // @ts-ignore
        <ActiveDashboardLayer key="ActiveDashboardLayer" />,
        // @ts-ignore
        <DashboardPreviewLayer key="DashboardPreviewLayer" />,
        // @ts-ignore
        <DashboardReportingOverlay key="DashboardReportingOverlay" />,
        // @ts-ignore
        <DashboardOverlay key="DashboardOverlay" />,
        // @ts-ignore
        <DashboardsLayer key="DashboardsLayer" />,
        // @ts-ignore
        <SelectedDashboardLayer key="SelectedDashboardLayer" />,
        // @ts-ignore
        <DashboardRecentActivityLayer key="DashboardRecentActivityLayer" />
      ]
    : []

  return (
    <BaseMap
    // BaseMap forwards map & mapClickEvent as props to children
    // handleMovingAndZoom={handleMovingAndZoom}
    // handlePointerMove={handlePointerMove}
    //
    // -> only add child to BaseMap if it requires map or mapClickEvent
    >
      {[...baseChildren, ...superUserChildren]}
    </BaseMap>
  )
}
