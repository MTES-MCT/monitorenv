import { MultiRadio } from '@mtes-mct/monitor-ui'
import {
  getGeoJSONFromFeature,
  getGeoJSONFromFeatureList,
  type MapClickEvent,
  type SerializedFeature
} from 'domain/types/map'
import { throttle } from 'lodash'
import { ScaleLine, defaults as defaultControls } from 'ol/control'
import Zoom from 'ol/control/Zoom'
import { platformModifierKeyOnly } from 'ol/events/condition'
import OpenLayerMap from 'ol/Map'
import { transform } from 'ol/proj'
import View from 'ol/View'
import {
  cloneElement,
  useCallback,
  useMemo,
  useEffect,
  useRef,
  useState,
  type MutableRefObject,
  Children,
  type ReactElement
} from 'react'
import styled from 'styled-components'

import { HIT_PIXEL_TO_TOLERANCE } from '../../constants'
import { SelectableLayers, HoverableLayers } from '../../domain/entities/layers/constants'
import { DistanceUnit, OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '../../domain/entities/map/constants'
import { setDistanceUnit } from '../../domain/shared_slices/Map'
import { updateMeasurementsWithNewDistanceUnit } from '../../domain/use_cases/map/updateMeasurementsWithNewDistanceUnit'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { useAppSelector } from '../../hooks/useAppSelector'
import { useClickOutsideWhenOpened } from '../../hooks/useClickOutsideWhenOpened'

import type { VectorLayerWithName } from '../../domain/types/layer'
import type { MapBrowserEvent } from 'ol'

export type BaseMapChildrenProps = {
  currentFeatureListOver: SerializedFeature<Record<string, any>>[] | undefined
  currentFeatureOver: SerializedFeature<Record<string, any>> | undefined
  map: OpenLayerMap
  mapClickEvent: MapClickEvent
  pixel: number[] | undefined
}

export function BaseMap({ children }: { children: Array<ReactElement<BaseMapChildrenProps> | null> }) {
  const dispatch = useAppDispatch()
  const [currentMap, setCurrentMap] = useState<OpenLayerMap | undefined>(undefined)
  const [mapClickEvent, setMapClickEvent] = useState<MapClickEvent>({
    coordinates: undefined,
    ctrlKeyPressed: false,
    feature: undefined,
    featureList: undefined
  })

  const [currentFeatureOver, setCurrentFeatureOver] = useState<SerializedFeature<Record<string, any>> | undefined>(
    undefined
  )
  const [currentFeatureListOver, setCurrentFeatureListOver] = useState<
    SerializedFeature<Record<string, any>>[] | undefined
  >(undefined)
  const [pixel, setPixel] = useState<number[] | undefined>(undefined)

  const mapElement = useRef() as MutableRefObject<HTMLDivElement>

  const wrapperRef = useRef(null)
  const distanceUnit = useAppSelector(state => state.map.distanceUnit)
  const [unitsSelectionIsOpen, setUnitsSelectionIsOpen] = useState(false)
  const clickedOutsideComponent = useClickOutsideWhenOpened(wrapperRef, unitsSelectionIsOpen)

  const handleMapClick = useCallback(
    (event: MapBrowserEvent<any>, current_map: OpenLayerMap) => {
      if (event && current_map) {
        const featureList = current_map.getFeaturesAtPixel(event.pixel, {
          hitTolerance: HIT_PIXEL_TO_TOLERANCE,
          layerFilter: layer => {
            const typedLayer = layer as VectorLayerWithName

            const layerName = typedLayer.name ?? typedLayer.get('name')

            return !!layerName && SelectableLayers.includes(layerName)
          }
        })
        const feature = getGeoJSONFromFeature<Record<string, any>>(featureList?.[0])
        const featuresAsGeoJSON = getGeoJSONFromFeatureList(featureList)
        const isCtrl = platformModifierKeyOnly(event)
        setMapClickEvent({
          coordinates: event.coordinate,
          ctrlKeyPressed: isCtrl,
          feature,
          featureList: featuresAsGeoJSON
        })
      }
    },
    [setMapClickEvent]
  )

  const handleMouseOverFeature = useMemo(
    () =>
      throttle((event: MapBrowserEvent<any>, current_map: OpenLayerMap) => {
        if (event && current_map) {
          const features = current_map.getFeaturesAtPixel(event.pixel, {
            hitTolerance: HIT_PIXEL_TO_TOLERANCE,
            layerFilter: layer => {
              const typedLayer = layer as VectorLayerWithName

              const layerName = typedLayer.name ?? typedLayer.get('name')

              return !!layerName && HoverableLayers.includes(layerName)
            }
          })
          setCurrentFeatureListOver(getGeoJSONFromFeatureList(features))

          setCurrentFeatureOver(getGeoJSONFromFeature(features?.[0]))

          setPixel(event.pixel)
        }
      }, 50),
    [setCurrentFeatureOver]
  )

  const control = useRef<ScaleLine>()

  const updateScaleControl = useCallback(() => {
    control.current = new ScaleLine({
      className: 'ol-scale-line',
      target: document.getElementById('scale-line') ?? undefined,
      units: distanceUnit
    })

    return control.current
  }, [distanceUnit])

  useEffect(() => {
    if (currentMap) {
      return
    }

    const centeredOnFrance = [2.99049, 46.82801]
    const initialMap = new OpenLayerMap({
      controls: defaultControls().extend([
        updateScaleControl(),
        new Zoom({
          className: 'zoom'
        })
      ]),
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
  }, [currentMap, handleMapClick, handleMouseOverFeature, updateScaleControl])

  const updateDistanceUnit = (value: DistanceUnit | undefined) => {
    if (!value) {
      return
    }
    control?.current?.setUnits(value)
    dispatch(setDistanceUnit(value))
    dispatch(updateMeasurementsWithNewDistanceUnit())
  }

  useEffect(() => {
    if (clickedOutsideComponent) {
      setUnitsSelectionIsOpen(false)
    }
  }, [clickedOutsideComponent])

  return (
    <MapWrapper>
      <MapContainer ref={mapElement} />
      {currentMap &&
        Children.map(
          children,
          child =>
            child &&
            cloneElement(child, {
              currentFeatureListOver,
              currentFeatureOver,
              map: currentMap,
              mapClickEvent,
              pixel
            })
        )}
      <StyledDistanceUnitContainer ref={wrapperRef}>
        <DistanceUnitsTypeSelection isOpen={unitsSelectionIsOpen}>
          <Header onClick={() => setUnitsSelectionIsOpen(false)}>Unités des distances</Header>
          <MultiRadio
            isInline
            isLabelHidden
            label="Unités de distance"
            name="unitsDistance"
            onChange={updateDistanceUnit}
            options={[
              { label: 'Nautiques', value: DistanceUnit.NAUTICAL },
              { label: 'Mètres', value: DistanceUnit.METRIC }
            ]}
            value={distanceUnit}
          />
        </DistanceUnitsTypeSelection>
      </StyledDistanceUnitContainer>
      <StyledScaleLine className="scale-line" id="scale-line" onClick={() => setUnitsSelectionIsOpen(true)} />
    </MapWrapper>
  )
}

const StyledScaleLine = styled.div``
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

const StyledDistanceUnitContainer = styled.div`
  z-index: 2;
`

const Header = styled.div`
  background-color: ${p => p.theme.color.charcoal};
  color: ${p => p.theme.color.gainsboro};
  padding: 5px 0;
  width: 100%;
  cursor: pointer;
`

const DistanceUnitsTypeSelection = styled.div<{ isOpen: boolean }>`
  position: absolute;
  bottom: 40px;
  left: 283px;
  display: inline-block;
  margin: 1px;
  color: ${p => p.theme.color.slateGray};
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background-color: ${p => p.theme.color.white};
  width: 191px;
  opacity: ${props => (props.isOpen ? 1 : 0)};
  visibility: ${props => (props.isOpen ? 'visible' : 'hidden')};
  height: ${props => (props.isOpen ? 69 : 0)}px;
  transition: all 0.5s;
  > fieldset {
    flex-grow: 2;
    justify-content: center;
  }
`
