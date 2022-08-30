import React from 'react'
// import React, { useState } from 'react'

import BaseMap from './BaseMap'
import BaseLayer from './layers/BaseLayer'
import RegulatoryLayers from './layers/RegulatoryLayers'
import AdministrativeLayers from './layers/AdministrativeLayers'
import MeasurementLayer from './layers/MeasurementLayer'
import RegulatoryPreviewLayer from './layers/RegulatoryPreviewLayer'
import InterestPointLayer from './layers/InterestPointLayer'
import { DrawLayer } from './layers/DrawLayer';
import { MissionsLayer } from './layers/MissionsLayer'
import { SelectedMissionLayer } from './layers/SelectedMissionLayer'
import { EditingMissionLayer } from './layers/EditingMissionLayer'
import { HoveredMissionLayer } from './layers/HoveredMissionLayer'

import { MissionOverlays } from './overlays/missions/MissionOverlays'
import { ControlOverlay } from './overlays/controls/ControlOverlay'

import ShowRegulatoryMetadata from './ShowRegulatoryMetadata'
import { MapExtentController } from './MapExtentController'
import MapHistory from './MapHistory'

import MapCoordinatesBox from './controls/MapCoordinatesBox'
import LayerDetailsBox from '../map/controls/LayerDetailsBox'



import { FEATURE_FLAGS } from '../../features';

const Map = () => {

  // const [shouldUpdateView, setShouldUpdateView] = useState(true)
  // const [historyMoveTrigger, setHistoryMoveTrigger] = useState({})
  // const [mapMovingAndZoomEvent, setMapMovingAndZoomEvent] = useState(null)
  // const [handlePointerMoveEventPixel, setHandlePointerMoveEventPixel] = useState(null)

  // const handleMovingAndZoom = () => {
  //   if (!shouldUpdateView) {
  //     setShouldUpdateView(true)
  //   }
  //   setHistoryMoveTrigger({ dummyUpdate: true })
  //   setMapMovingAndZoomEvent({ dummyUpdate: true })
  // }

  // const handlePointerMove = (event) => {
  //   if (event) {
  //     setHandlePointerMoveEventPixel(event.pixel)
  //   }
  // }

  return (
    <BaseMap
      // BaseMap forwards map & mapClickEvent as props to children
      // handleMovingAndZoom={handleMovingAndZoom}
      // handlePointerMove={handlePointerMove}
      showAttributions={true}
      container={'map'}
    >
      <MapCoordinatesBox/>
      <BaseLayer />
      <RegulatoryLayers/>
      <AdministrativeLayers />
      <MeasurementLayer/>
      <ShowRegulatoryMetadata />
      <MapExtentController />
      <MapHistory />
      {FEATURE_FLAGS.LOCALIZE_MISSIONS && <DrawLayer/>}
      {FEATURE_FLAGS.LOCALIZE_MISSIONS && <MissionsLayer/>}
      {FEATURE_FLAGS.LOCALIZE_MISSIONS && <SelectedMissionLayer/>}
      {FEATURE_FLAGS.LOCALIZE_MISSIONS && <EditingMissionLayer/>}
      {FEATURE_FLAGS.LOCALIZE_MISSIONS && <HoveredMissionLayer/>}
      {FEATURE_FLAGS.LOCALIZE_MISSIONS && <MissionOverlays/>}
      {FEATURE_FLAGS.LOCALIZE_MISSIONS && <ControlOverlay/>}
      <LayerDetailsBox />
      <InterestPointLayer/>
      <RegulatoryPreviewLayer /> 
    </BaseMap>
  )
}

export default Map
