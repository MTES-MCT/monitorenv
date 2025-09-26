import { MultiRadio, OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '@mtes-mct/monitor-ui'
import { isCypress } from '@utils/isCypress'
import {
  getGeoJSONFromFeature,
  getGeoJSONFromFeatureList,
  type MapClickEvent,
  type SerializedFeature
} from 'domain/types/map'
import { throttle, isEqual } from 'lodash-es'
import { defaults as defaultControls, ScaleLine } from 'ol/control'
import Zoom from 'ol/control/Zoom'
import { platformModifierKeyOnly } from 'ol/events/condition'
import OpenLayerMap from 'ol/Map'
import { transform } from 'ol/proj'
import View from 'ol/View'
import {
  Children,
  cloneElement,
  memo,
  type MutableRefObject,
  type ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import styled from 'styled-components'

import { getHighestPriorityFeatures } from './utils'
import { HIT_PIXEL_TO_TOLERANCE } from '../../constants'
import {
  HoverableLayers0To7,
  HoverableLayers7To26,
  SelectableLayers0To7,
  SelectableLayers7To26
} from '../../domain/entities/layers/constants'
import { DistanceUnit } from '../../domain/entities/map/constants'
import { setDistanceUnit } from '../../domain/shared_slices/Map'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { useAppSelector } from '../../hooks/useAppSelector'
import { useClickOutsideWhenOpened } from '../../hooks/useClickOutsideWhenOpened'

import type { VectorLayerWithName, WebGLVectorLayerWithName } from '../../domain/types/layer'
import type { MapBrowserEvent } from 'ol'

export type BaseMapChildrenProps = {
  currentFeatureListOver?: SerializedFeature<Record<string, any>>[]
  currentFeatureOver: SerializedFeature<Record<string, any>>
  map: OpenLayerMap
  mapClickEvent: MapClickEvent
  pixel?: number[]
}

export const CENTERED_ON_FRANCE = [2.99049, 46.82801]
export const initialMap = new OpenLayerMap({
  controls: defaultControls().extend([
    new Zoom({
      className: 'zoom'
    })
  ]),
  layers: [],

  view: new View({
    center: transform(CENTERED_ON_FRANCE, WSG84_PROJECTION, OPENLAYERS_PROJECTION),
    minZoom: 3,
    projection: OPENLAYERS_PROJECTION,
    zoom: 6
  })
})

function BaseMapNotMemoized({ children }: { children: Array<ReactElement<BaseMapChildrenProps> | null> }) {
  const dispatch = useAppDispatch()

  const [mapClickEvent, setMapClickEvent] = useState<MapClickEvent>({
    coordinates: undefined,
    ctrlKeyPressed: false,
    feature: undefined,
    featureList: undefined
  })

  const [currentFeatureOver, setCurrentFeatureOver] = useState<SerializedFeature<Record<string, any>> | undefined>(
    undefined
  )
  const [currentFeatureListOver, setCurrentFeatureListOver] = useState<SerializedFeature<Record<string, any>>[]>([])

  const [pixel, setPixel] = useState<number[] | undefined>(undefined)

  const safeSetCurrentFeatureListOver = useCallback(newList => {
    setCurrentFeatureListOver(prevList => {
      if (isEqual(prevList, newList)) {
        return prevList
      }

      return newList
    })
  }, [])

  const safeSetCurrentFeatureOver = useCallback(newFeature => {
    setCurrentFeatureOver(prevFeature => {
      if (isEqual(prevFeature, newFeature)) {
        return prevFeature
      }

      return newFeature
    })
  }, [])

  const safeSetPixel = useCallback(newPixel => {
    setPixel(prevPixel => {
      if (
        prevPixel &&
        newPixel &&
        prevPixel.length === newPixel.length &&
        prevPixel.every((v, i) => v === newPixel[i])
      ) {
        return prevPixel
      }

      return newPixel
    })
  }, [])

  const mapElement = useRef() as MutableRefObject<HTMLDivElement>

  const wrapperRef = useRef(null)
  const distanceUnit = useAppSelector(state => state.map.distanceUnit)
  const [unitsSelectionIsOpen, setUnitsSelectionIsOpen] = useState(false)
  const clickedOutsideComponent = useClickOutsideWhenOpened(wrapperRef, unitsSelectionIsOpen)

  const handleMapClick = useCallback((event: MapBrowserEvent<any>, current_map: OpenLayerMap) => {
    if (event && current_map) {
      const zoomLevel = current_map.getView().getZoom()
      if (!zoomLevel) {
        return
      }

      const priorityLayersOrder = zoomLevel < 7 ? SelectableLayers0To7 : SelectableLayers7To26

      const features = current_map.getFeaturesAtPixel(event.pixel, {
        hitTolerance: HIT_PIXEL_TO_TOLERANCE,
        layerFilter: layer => {
          const typedLayer = layer as VectorLayerWithName

          const layerName = typedLayer.name ?? typedLayer.get('name')

          return !!layerName && priorityLayersOrder.flat().includes(layerName)
        }
      })

      const priorityFeatures = getHighestPriorityFeatures(features, priorityLayersOrder)

      const feature = getGeoJSONFromFeature<Record<string, any>>(priorityFeatures?.[0])
      const featuresAsGeoJSON = getGeoJSONFromFeatureList(priorityFeatures)
      const isCtrl = platformModifierKeyOnly(event)
      setMapClickEvent({
        coordinates: event.coordinate,
        ctrlKeyPressed: isCtrl,
        feature,
        featureList: featuresAsGeoJSON
      })
    }
  }, [])

  const handleMouseOverFeature = useMemo(
    () =>
      throttle((event: MapBrowserEvent<any>, current_map: OpenLayerMap) => {
        if (event && current_map) {
          const zoomLevel = current_map.getView().getZoom()
          if (!zoomLevel) {
            return
          }

          const priorityLayersOrder = zoomLevel < 7 ? HoverableLayers0To7 : HoverableLayers7To26

          const features = current_map.getFeaturesAtPixel(event.pixel, {
            hitTolerance: HIT_PIXEL_TO_TOLERANCE,
            layerFilter: layer => {
              const typedLayer = layer as VectorLayerWithName | WebGLVectorLayerWithName

              const layerName = typedLayer.name ?? typedLayer.get('name')

              return !!layerName && priorityLayersOrder.flat().includes(layerName)
            }
          })
          const priorityFeatures = getHighestPriorityFeatures(features, priorityLayersOrder)

          const featureListHover = getGeoJSONFromFeatureList(priorityFeatures) as SerializedFeature<
            Record<string, any>
          >[]

          const hoveredFeature = getGeoJSONFromFeature<Record<string, any>>(priorityFeatures?.[0])

          safeSetCurrentFeatureListOver(featureListHover)
          safeSetCurrentFeatureOver(hoveredFeature)
          safeSetPixel(event.pixel)
        }
      }, 50),
    [safeSetCurrentFeatureListOver, safeSetCurrentFeatureOver, safeSetPixel]
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
    initialMap.setTarget(mapElement.current)
    initialMap.addControl(updateScaleControl())
    initialMap.on('click', event => handleMapClick(event, initialMap))
    initialMap.on('pointermove', event => handleMouseOverFeature(event, initialMap))

    return () => {
      initialMap.un('click', event => handleMapClick(event, initialMap))
      initialMap.un('pointermove', event => handleMouseOverFeature(event, initialMap))
      initialMap.setTarget(undefined)
      initialMap.getControls().clear()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const updateDistanceUnit = (value: DistanceUnit | undefined) => {
    if (!value) {
      return
    }
    control?.current?.setUnits(value)
    dispatch(setDistanceUnit(value))
  }

  useEffect(() => {
    if (clickedOutsideComponent) {
      setUnitsSelectionIsOpen(false)
    }
  }, [clickedOutsideComponent])

  // Only expose helpers when running under Cypress
  if (isCypress()) {
    globalThis.olTestUtils = {
      getFeaturesFromLayer: (name: string, layerPixel: [number, number]) => {
        const layer = initialMap.getFeaturesAtPixel(layerPixel, {
          hitTolerance: HIT_PIXEL_TO_TOLERANCE * 2,
          layerFilter: l => {
            const cypressLayer = l as VectorLayerWithName | WebGLVectorLayerWithName

            return cypressLayer.name === name || cypressLayer.get('name') === name
          }
        })

        return layer ?? []
      }
    }
  }

  return (
    <MapWrapper>
      <MapContainer ref={mapElement} />
      {Children.map(
        children,
        child =>
          child &&
          cloneElement(child, {
            currentFeatureListOver,
            currentFeatureOver,
            map: initialMap,
            mapClickEvent,
            pixel
          })
      )}
      <StyledDistanceUnitContainer ref={wrapperRef}>
        <DistanceUnitsTypeSelection $isOpen={unitsSelectionIsOpen}>
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

export const BaseMap = memo(BaseMapNotMemoized)

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

const DistanceUnitsTypeSelection = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  bottom: 40px;
  left: 283px;
  margin: 1px;
  color: ${p => p.theme.color.slateGray};
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background-color: ${p => p.theme.color.white};
  width: 191px;
  opacity: ${props => (props.$isOpen ? 1 : 0)};
  visibility: ${props => (props.$isOpen ? 'visible' : 'hidden')};
  height: ${props => (props.$isOpen ? 69 : 0)}px;
  transition: all 0.5s;

  > fieldset {
    flex-grow: 2;
    justify-content: center;
  }
`
