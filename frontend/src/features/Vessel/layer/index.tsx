import { overlayStroke } from '@features/map/overlays/style'
import { useAppSelector } from '@hooks/useAppSelector'
import { OPENLAYERS_PROJECTION, THEME, WSG84_PROJECTION } from '@mtes-mct/monitor-ui'
import { Feature } from 'ol'
import { GeoJSON } from 'ol/format'
import { type Geometry, type Point } from 'ol/geom'
import LineString from 'ol/geom/LineString'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { Circle, Fill, Icon, Stroke, Style } from 'ol/style'
import CircleStyle from 'ol/style/Circle'
import React, { useEffect, useRef } from 'react'

import { Layers } from '../../../domain/entities/layers/constants'

import type { VectorLayerWithName } from '../../../domain/types/layer'
import type { BaseMapChildrenProps } from '@features/map/BaseMap'
import type { FeatureLike } from 'ol/Feature'

export function AISPositionsLayer({ map }: BaseMapChildrenProps) {
  const { displayedPositions, hasReportings } = useAppSelector(state => state.vessel.selectedVessel)
  const overlayCoordinates = useAppSelector(state => state.global.overlayCoordinates)

  const vectorSourceRef = useRef(new VectorSource()) as React.MutableRefObject<VectorSource<Feature<Geometry>>>
  const vectorLayerRef = useRef(
    new VectorLayer({
      renderBuffer: 7,
      source: vectorSourceRef.current,
      zIndex: Layers.VESSEL_POSITIONS.zIndex
    })
  ) as React.MutableRefObject<VectorLayerWithName>
  vectorLayerRef.current.name = Layers.VESSEL_POSITIONS.code

  useEffect(() => {
    if (map) {
      vectorSourceRef.current.clear(true)

      if (displayedPositions && displayedPositions?.length > 0) {
        const geoJSON = new GeoJSON()

        // Add all positions
        const positionsFeatures = displayedPositions.map(position => {
          const geometry = geoJSON.readGeometry(position.geom, {
            dataProjection: WSG84_PROJECTION,
            featureProjection: OPENLAYERS_PROJECTION
          })

          const feature = new Feature({ geometry })
          const id = `${Layers.VESSEL_POSITIONS.code}:${position.id}`
          feature.setId(id)
          const overlayCoordinate = overlayCoordinates.find(({ name }) => name === id)
          feature.setProperties({ ...position, overlayCoordinates: overlayCoordinate })

          feature.setStyle([
            new Style({
              image: new CircleStyle({
                fill: new Fill({ color: THEME.color.charcoal }),
                radius: 3
              })
            }),
            overlayStroke
          ])

          return feature
        })
        if (positionsFeatures) {
          vectorSourceRef.current.addFeatures(positionsFeatures)
        }

        // Link all positions
        const coordinates = displayedPositions
          .map(
            position =>
              geoJSON.readGeometry(position.geom, {
                dataProjection: WSG84_PROJECTION,
                featureProjection: OPENLAYERS_PROJECTION
              }) as Point
          )
          .map(point => point.getCoordinates())

        const lineGeometry = new LineString(coordinates)

        const lineFeature = new Feature({
          geometry: lineGeometry
        })

        lineFeature.setStyle(
          new Style({
            stroke: new Stroke({
              color: THEME.color.charcoal,
              width: 2
            })
          })
        )
        if (lineFeature) {
          vectorSourceRef.current.addFeature(lineFeature)
        }

        // Show vessel on last position
        const [lastPosition] = displayedPositions
        const vesselGeometry = geoJSON.readGeometry(lastPosition?.geom, {
          dataProjection: WSG84_PROJECTION,
          featureProjection: OPENLAYERS_PROJECTION
        })
        const vesselFeature = new Feature({ geometry: vesselGeometry })
        vesselFeature.setStyle(getSelectedVesselStyle())
        vesselFeature.setProperties({
          ...lastPosition,
          geom: null,
          hasReportings
        })

        if (vesselFeature) {
          vectorSourceRef.current.addFeature(vesselFeature)
        }
      }
    }
  }, [hasReportings, map, displayedPositions, overlayCoordinates])

  useEffect(() => {
    map.getLayers().push(vectorLayerRef.current)

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      map.removeLayer(vectorLayerRef.current)
    }
  }, [map])

  useEffect(() => {
    vectorLayerRef.current?.setVisible(true)
  }, [])
}

export const getSelectedVesselStyle = () => (feature: FeatureLike, resolution: number) => {
  const course = feature.get('course')
  const hasReportings = feature.get('hasReportings')
  const vesselStyle = new Style({
    image: new Icon({
      color: THEME.color.charcoal,
      offset: [0, 50],
      opacity: 1,
      rotation: degreesToRadian(course),
      scale: 0.8,
      size: [50, 50],
      src: 'icons/boat.png'
    })
  })
  if (hasReportings) {
    const redCircle = new Style({
      image: new Circle({
        fill: undefined,
        radius: 19,
        scale: Math.min(1, 0.3 + Math.sqrt(200 / resolution)),
        stroke: new Stroke({
          color: THEME.color.maximumRed,
          width: 2
        })
      })
    })

    return [vesselStyle, redCircle]
  }

  return [vesselStyle]
}

export function degreesToRadian(course: number) {
  return (course * Math.PI) / 180
}
