import React, { Children, cloneElement, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import OpenLayerMap from 'ol/Map'
import View from 'ol/View'
import { transform } from 'ol/proj'
import ScaleLine from 'ol/control/ScaleLine'
import Zoom from 'ol/control/Zoom'

import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '../../domain/entities/map'

import MapAttributionsBox from './controls/MapAttributionsBox'
import { HIT_PIXEL_TO_TOLERANCE } from '../../constants/constants'
import { platformModifierKeyOnly } from 'ol/events/condition'



const BaseMap = ({ children, showAttributions }) => {

  const {
    healthcheckTextWarning,
    previewFilteredVesselsMode
  } = useSelector(state => state.global)

  const [map, setMap] = useState()
  
  /** @type {MapClickEvent} mapClickEvent */
  const [mapClickEvent, setMapClickEvent] = useState(null)

  const mapElement = useRef()
  const mapRef = useRef()
  mapRef.current = map

  const handleMapClick = (event, map) => {
    if (event && map) {
      const feature = map.forEachFeatureAtPixel(event.pixel, feature => feature, { hitTolerance: HIT_PIXEL_TO_TOLERANCE })
      const isCtrl = platformModifierKeyOnly(event)
      setMapClickEvent({ feature, ctrlKeyPressed: isCtrl })
    }
  }


  useEffect(() => {
    if (!map) {
      const centeredOnFrance = [2.99049, 46.82801]
      const initialMap = new OpenLayerMap({
        keyboardEventTarget: document,
        target: mapElement.current,
        layers: [],
        renderer: (['webgl', 'canvas']),
        view: new View({
          projection: OPENLAYERS_PROJECTION,
          center: transform(centeredOnFrance, WSG84_PROJECTION, OPENLAYERS_PROJECTION),
          zoom: 6,
          minZoom: 3
        }),
        controls: [
          new ScaleLine({ units: 'nautical' }),
          new Zoom({
            className: 'zoom'
          })
        ]
      })

      initialMap.on('click', event => handleMapClick(event, initialMap))

      setMap(initialMap)
    }
  }, [map])



  

  

  return (
    <MapWrapper>
      <MapContainer
        ref={mapElement}
        healthcheckTextWarning={healthcheckTextWarning}
        previewFilteredVesselsMode={previewFilteredVesselsMode}
      />
      {showAttributions && <MapAttributionsBox/>}
      {map && Children.map(children, (child) => (
        child && cloneElement(child, { map, mapClickEvent })
      ))}
    </MapWrapper>
  )
}

const MapWrapper = styled.div`
  display: flex;
  flex: 1;
`

const MapContainer = styled.div`
  height: ${props => props.healthcheckTextWarning || props.previewFilteredVesselsMode ? 'calc(100vh - 50px)' : '100vh'};
  width: 100%;
  overflow-y: hidden;
  overflow-x: hidden;
`

export default BaseMap
