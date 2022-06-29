import React from 'react'
// import React, { useState } from 'react'

import BaseMap from './BaseMap'
import BaseLayer from '../../layers/BaseLayer'
import MapCoordinatesBox from './controls/MapCoordinatesBox'
import RegulatoryLayers from '../../layers/RegulatoryLayers'
import AdministrativeLayers from '../../layers/AdministrativeLayers'
import ShowRegulatoryMetadata from './ShowRegulatoryMetadata'
import RegulatoryPreviewLayer from '../../layers/RegulatoryPreviewLayer'
import MeasurementLayer from '../../layers/MeasurementLayer'
import InterestPointLayer from '../../layers/InterestPointLayer'
import LayerDetailsBox from '../map/controls/LayerDetailsBox'
import { MapExtentController } from './MapExtentController'
import MapHistory from './MapHistory'
import { DrawLayer } from '../drawLayer/DrawLayer';

import { FEATURE_FLAGS } from '../../features';
import { MissionsLayer } from '../../layers/MissionsLayer'

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
      <ShowRegulatoryMetadata />
      <MapExtentController />
      <MapHistory />
      <MeasurementLayer/>
      {FEATURE_FLAGS.LOCALIZE_MISSIONS && <DrawLayer/>}
      {FEATURE_FLAGS.LOCALIZE_MISSIONS && <MissionsLayer/>}
      <LayerDetailsBox />
      <InterestPointLayer/>
      <RegulatoryPreviewLayer /> 
    </BaseMap>
  )
}

export default Map
