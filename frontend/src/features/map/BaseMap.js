import React, { Children, cloneElement, useCallback, useMemo, useEffect, useRef, useState } from 'react'
import _ from 'lodash'
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
import { SelectableLayers, HoverableLayers } from '../../domain/entities/layers'



const BaseMap = ({ children, showAttributions }) => {

  const [map, setMap] = useState()
  
  /** @type {MapClickEvent} mapClickEvent */
  const [mapClickEvent, setMapClickEvent] = useState(null)
  
  /** @type {currentFeatureOver} feature */
  const [currentFeatureOver, setCurrentFeatureOver] = useState(null)

  const mapElement = useRef()

  const handleMapClick = useCallback((event, current_map) => {
    if (event && current_map) {
      const feature = current_map.forEachFeatureAtPixel(event.pixel, f => f, { hitTolerance: HIT_PIXEL_TO_TOLERANCE, layerFilter: (l)=> {
        return SelectableLayers.includes(l.name)
      } })
      const isCtrl = platformModifierKeyOnly(event)
      setMapClickEvent({ feature, ctrlKeyPressed: isCtrl })
    }
  }, [setMapClickEvent])
  
  const handleMouseOverFeature = useMemo(() => _.throttle((event, current_map)=> {
    if (event && current_map) {
      const feature = current_map.forEachFeatureAtPixel(event.pixel, f => f, { hitTolerance: HIT_PIXEL_TO_TOLERANCE, layerFilter: (l)=> {
        return HoverableLayers.includes(l.name)
      } })
      setCurrentFeatureOver( feature )
    }

  }, 50), [setCurrentFeatureOver])

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
      initialMap.on('pointermove', event => handleMouseOverFeature(event, initialMap))

      setMap(initialMap)
    }
  }, [map, handleMapClick])



  

  

  return (
    <MapWrapper>
      <MapContainer
        ref={mapElement}
      />
      {showAttributions && <MapAttributionsBox/>}
      {map && Children.map(children, (child) => (
        child && cloneElement(child, { map, mapClickEvent, currentFeatureOver })
      ))}
    </MapWrapper>
  )
}

const MapWrapper = styled.div`
  display: flex;
  flex: 1;
`

const MapContainer = styled.div`
  height: 100vh;
  width: 100%;
  overflow-y: hidden;
  overflow-x: hidden;
`

export default BaseMap
