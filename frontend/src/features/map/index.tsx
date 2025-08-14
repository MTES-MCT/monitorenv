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
import { LocateOnMapLayer } from '@features/LocateOnMap/Layer'
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
import { RecentActivityOverlay } from '@features/RecentActivity/components/Overlays'
import { RecentActivityLegend } from '@features/RecentActivity/components/RecentActivityLegend'
import { VigilanceAreasLayer } from '@features/VigilanceArea/components/VigilanceAreaLayer'
import { DrawVigilanceAreaLayer } from '@features/VigilanceArea/components/VigilanceAreaLayer/DrawVigilanceAreaLayer'
import { EditingVigilanceAreaLayer } from '@features/VigilanceArea/components/VigilanceAreaLayer/EditingVigilanceAreaLayer'
import { PreviewVigilanceAreasLayer } from '@features/VigilanceArea/components/VigilanceAreaLayer/PreviewVigilanceAreasLayer'
import { SelectedVigilanceAreaLayer } from '@features/VigilanceArea/components/VigilanceAreaLayer/SelectedVigilanceAreaLayer'
import { useAppSelector } from '@hooks/useAppSelector'
import { useMemo } from 'react'

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

  const baseChildren = useMemo(
    () => [
      <ZoomListener key="ZoomListener" />,
      <MapAttributionsBox key="MapAttributionsBox" />,
      <MapCoordinatesBox key="MapCoordinatesBox" />,
      <MapLayer key="MapLayer" />,

      // ZONE

      <AMPLayers key="AMPLayers" />,
      <AMPPreviewLayer key="AMPPreviewLayer" />,
      <RegulatoryLayers key="RegulatoryLayers" />,
      <RegulatoryPreviewLayer key="RegulatoryPreviewLayer" />,
      <AdministrativeLayers key="AdministrativeLayers" />,
      <SearchExtentLayer key="SearchExtentLayer" />,
      <LayerEvents key="LayerEvents" />,
      <LayersOverlay key="LayersOverlay" />,

      // MAP
      <MapExtentController key="MapExtentController" />,
      <MapHistory key="MapHistory" />,

      // SEMAPHORE
      <SemaphoresLayer key="SemaphoresLayer" />,
      <SemaphoreOverlay key="SemaphoreOverlay" />,

      // REPORTING
      <EditingReportingLayer key="EditingReportingLayer" />,
      <SelectedReportingLayer key="SelectedReportingLayer" />,
      <HoveredReportingLayer key="HoveredReportingLayer" />,
      <ReportingsLayer key="ReportingsLayer" />,
      <ReportingOverlay key="ReportingOverlay" />,

      // VIGILANCE AREA
      <VigilanceAreasLayer key="VigilanceAreasLayer" />,
      <PreviewVigilanceAreasLayer key="PreviewVigilanceAreasLayer" />,
      <SelectedVigilanceAreaLayer key="SelectedVigilanceAreaLayer" />,

      // RECENT ACTIVITY
      <RecentControlsActivityLayer key="RecentControlsActivityLayer" />,
      <DrawRecentActivityLayer key="DrawRecentActivityLayer" />,
      <RecentActivityLayerEvents key="RecentActivityLayerEvents" />,
      <RecentActivityOverlay key="RecentActivityOverlay" />,

      displayRecentActivityLegend ? <RecentActivityLegend key="RecentActivityLegend" location="OUTSIDE" /> : null,

      // LOCALIZED AREAS
      <LocalizedAreasLayer key="LocalizedAreasLayer" />,

      // LOCATE ON MAP
      <LocateOnMapLayer key="LocateOnMapLayer" />
    ],
    [displayRecentActivityLegend]
  )

  const superUserChildren = useMemo(() => {
    if (!isSuperUser) {
      return []
    }

    return [
      <MeasurementLayer key="MeasurementLayer" />,
      <InterestPointLayer key="InterestPointLayer" />,
      <DrawLayer key="DrawLayer" />,

      <MissionsLayer key="MissionsLayer" />,
      <SelectedMissionLayer key="SelectedMissionLayer" />,
      <EditingMissionLayer key="EditingMissionLayer" />,
      <HoveredMissionLayer key="HoveredMissionLayer" />,
      <MissionOverlays key="MissionOverlays" />,
      <ActionOverlay key="ActionOverlay" />,

      <ReportingToAttachLayer key="ReportingToAttachLayer" />,
      <HoveredReportingToAttachLayer key="HoveredReportingToAttachLayer" />,
      <ReportingToAttachOverlays key="ReportingToAttachOverlays" />,

      <HoveredSemaphoreLayer key="HoveredSemaphoreLayer" />,
      <SelectedSemaphoreLayer key="SelectedSemaphoreLayer" />,

      <MissionToAttachLayer key="MissionToAttachLayer" />,
      <HoveredMissionToAttachLayer key="HoveredMissionToAttachLayer" />,
      <SelectedMissionToAttachLayer key="SelectedMissionToAttachLayer" />,
      <MissionToAttachOverlays key="MissionToAttachOverlays" />,

      <StationLayer key="StationLayer" />,
      <StationOverlay key="StationOverlay" />,

      <DrawVigilanceAreaLayer key="DrawVigilanceAreaLayer" />,
      <EditingVigilanceAreaLayer key="EditingVigilanceAreaLayer" />,

      <DrawDashboardLayer key="DrawDashboardLayer" />,
      <ActiveDashboardLayer key="ActiveDashboardLayer" />,
      <DashboardPreviewLayer key="DashboardPreviewLayer" />,
      <DashboardReportingOverlay key="DashboardReportingOverlay" />,
      <DashboardOverlay key="DashboardOverlay" />,
      <DashboardsLayer key="DashboardsLayer" />,
      <SelectedDashboardLayer key="SelectedDashboardLayer" />,
      <DashboardRecentActivityLayer key="DashboardRecentActivityLayer" />
    ]
  }, [isSuperUser])

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
