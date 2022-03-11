import React from 'react'
// import React, { useState } from 'react'

import BaseMap from './BaseMap'
import BaseLayer from '../../layers/BaseLayer'
// import DrawLayer from '../../layers/DrawLayer'
import RegulatoryLayers from '../../layers/RegulatoryLayers'
import AdministrativeLayers from '../../layers/AdministrativeLayers'
import ShowRegulatoryMetadata from './ShowRegulatoryMetadata'
import RegulatoryPreviewLayer from '../../layers/RegulatoryPreviewLayer'
import MeasurementLayer from '../../layers/MeasurementLayer'
import LayerDetailsBox from '../map/controls/LayerDetailsBox'
// import MapHistory from './MapHistory'
// import InterestPointLayer from '../../layers/InterestPointLayer'

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
      showCoordinates={true}
      showAttributions={true}
      container={'map'}
    >
      <BaseLayer />
      <RegulatoryLayers/>
      <AdministrativeLayers />
      <ShowRegulatoryMetadata />
      {/* <MapHistory
        shouldUpdateView={shouldUpdateView}
        setShouldUpdateView={setShouldUpdateView}
        historyMoveTrigger={historyMoveTrigger}
      /> */}
      <MeasurementLayer/>
      {/* <DrawLayer/> */}
      <LayerDetailsBox />
      {/*<InterestPointLayer mapMovingAndZoomEvent={mapMovingAndZoomEvent}/>*/}
      <RegulatoryPreviewLayer /> 
    </BaseMap>
  )
}

export default Map
