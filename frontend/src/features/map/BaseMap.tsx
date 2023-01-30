import _ from 'lodash'
import ScaleLine from 'ol/control/ScaleLine'
import Zoom from 'ol/control/Zoom'
import { platformModifierKeyOnly } from 'ol/events/condition'
import OpenLayerMap from 'ol/Map'
import { transform } from 'ol/proj'
import View from 'ol/View'
import { Children, cloneElement, useCallback, useMemo, useEffect, useRef, useState, MutableRefObject } from 'react'
import styled from 'styled-components'

import { HIT_PIXEL_TO_TOLERANCE } from '../../constants/constants'
import { SelectableLayers, HoverableLayers } from '../../domain/entities/layers/constants'
import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '../../domain/entities/map/constants'

import type Map from 'ol/Map'

export function BaseMap({ children }) {
  const [currentMap, setCurrentMap] = useState<Map>()

  const [mapClickEvent, setMapClickEvent] = useState({ ctrlKeyPressed: false, feature: undefined })

  /** @type {currentFeatureOver} feature */
  const [currentFeatureOver, setCurrentFeatureOver] = useState(null)

  const mapElement = useRef() as MutableRefObject<HTMLDivElement>

  const handleMapClick = useCallback(
    (event, current_map) => {
      if (event && current_map) {
        const feature = current_map.forEachFeatureAtPixel(event.pixel, f => f, {
          hitTolerance: HIT_PIXEL_TO_TOLERANCE,
          layerFilter: l => {
            const name = l.name || l.get('name')

            return SelectableLayers.includes(name)
          }
        })
        const isCtrl = platformModifierKeyOnly(event)
        setMapClickEvent({ ctrlKeyPressed: isCtrl, feature })
      }
    },
    [setMapClickEvent]
  )

  const handleMouseOverFeature = useMemo(
    () =>
      _.throttle((event, current_map) => {
        if (event && current_map) {
          const feature = current_map.forEachFeatureAtPixel(event.pixel, f => f, {
            hitTolerance: HIT_PIXEL_TO_TOLERANCE,
            layerFilter: l => HoverableLayers.includes(l.name)
          })
          setCurrentFeatureOver(feature)
        }
      }, 50),
    [setCurrentFeatureOver]
  )

  useEffect(() => {
    if (!currentMap) {
      const centeredOnFrance = [2.99049, 46.82801]
      const initialMap = new OpenLayerMap({
        controls: [
          new ScaleLine({ units: 'nautical' }),
          new Zoom({
            className: 'zoom'
          })
        ],
        keyboardEventTarget: document,
        layers: [],
        target: mapElement.current,
        view: new View({
          center: transform(centeredOnFrance, WSG84_PROJECTION, OPENLAYERS_PROJECTION),
          minZoom: 3,
          projection: OPENLAYERS_PROJECTION,
          zoom: 6
        })
      })
      initialMap.on('click', event => handleMapClick(event, initialMap))
      initialMap.on('pointermove', event => handleMouseOverFeature(event, initialMap))

      setCurrentMap(initialMap)
    }
  }, [currentMap, handleMapClick, handleMouseOverFeature])

  return (
    <MapWrapper>
      <MapContainer ref={mapElement} />
      {currentMap &&
        Children.map(
          children,
          child => child && cloneElement(child, { currentFeatureOver, map: currentMap, mapClickEvent })
        )}
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
