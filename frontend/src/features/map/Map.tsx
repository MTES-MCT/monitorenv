import { BaseMap } from './BaseMap'
import { MapAttributionsBox } from './controls/MapAttributionsBox'
import { MapCoordinatesBox } from './controls/MapCoordinatesBox'
import { AdministrativeLayers } from './layers/AdministrativeLayers'
import { AMPLayers } from './layers/AMPLayers'
import { AMPPreviewLayer } from './layers/AMPPreviewLayer'
import { BaseLayer } from './layers/BaseLayer'
import { DrawLayer } from './layers/DrawLayer'
import { EditingMissionLayer } from './layers/EditingMissionLayer'
import { HoveredMissionLayer } from './layers/HoveredMissionLayer'
import { InterestPointLayer } from './layers/InterestPointLayer'
import { MeasurementLayer } from './layers/MeasurementLayer'
import { MissionsLayer } from './layers/MissionsLayer'
import { RegulatoryLayers } from './layers/RegulatoryLayers'
import { RegulatoryPreviewLayer } from './layers/RegulatoryPreviewLayer'
import { ReportingsLayer } from './layers/Reportings'
import { SelectedMissionLayer } from './layers/SelectedMissionLayer'
import { SemaphoresLayer } from './layers/Semaphores'
import { MapExtentController } from './MapExtentController'
import { MapHistory } from './MapHistory'
import { ActionOverlay } from './overlays/actions'
import { MissionOverlays } from './overlays/missions'
import { ReportingOverlay } from './overlays/reportings'
import { SemaphoreOverlay } from './overlays/semaphores'
import { Reporting } from './reportingForm'
import { ShowRegulatoryMetadata } from './ShowRegulatoryMetadata'

import type { MapClickEvent } from '../../types'
import type { Feature } from 'ol'
import type { Geometry } from 'ol/geom'
import type OpenLayerMap from 'ol/Map'

export type MapChildrenProps = Partial<{
  currentFeatureOver: Feature<Geometry>
  map: OpenLayerMap
  mapClickEvent: MapClickEvent
}>

export function Map() {
  return (
    <BaseMap>
      <MapAttributionsBox />
      <MapCoordinatesBox />
      <BaseLayer />
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
      <MissionsLayer />
      <SelectedMissionLayer />
      <EditingMissionLayer />
      <HoveredMissionLayer />
      <MissionOverlays />
      <ActionOverlay />
      <SemaphoresLayer />
      <SemaphoreOverlay />
      <Reporting />
      <ReportingsLayer />
      <ReportingOverlay />
    </BaseMap>
  )
}
