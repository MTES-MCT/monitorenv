import { useGetVesselQuery } from '@api/vesselsApi'
import { useAppSelector } from '@hooks/useAppSelector'
import { OPENLAYERS_PROJECTION, THEME, WSG84_PROJECTION } from '@mtes-mct/monitor-ui'
import { skipToken } from '@reduxjs/toolkit/query'
import { Feature } from 'ol'
import { GeoJSON } from 'ol/format'
import { type Geometry } from 'ol/geom'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { Circle, Icon, Stroke, Style } from 'ol/style'
import React, { useEffect, useRef } from 'react'

import { Layers } from '../../../domain/entities/layers/constants'

import type { VectorLayerWithName } from '../../../domain/types/layer'
import type { BaseMapChildrenProps } from '@features/map/BaseMap'
import type { FeatureLike } from 'ol/Feature'

export function LastPositionsLayer({ map }: BaseMapChildrenProps) {
  const { hasReportings, id: selectedVesselId } = useAppSelector(state => state.vessel.selectedVessel)

  const { data: vessel } = useGetVesselQuery(selectedVesselId || skipToken)

  const vectorSourceRef = useRef(new VectorSource()) as React.MutableRefObject<VectorSource<Feature<Geometry>>>
  const vectorLayerRef = useRef(
    new VectorLayer({
      renderBuffer: 7,
      source: vectorSourceRef.current,
      style: (feature, resolution) => getSelectedVesselStyle(feature, resolution),
      zIndex: Layers.LAST_POSITIONS.zIndex
    })
  ) as React.MutableRefObject<VectorLayerWithName>
  vectorLayerRef.current.name = Layers.LAST_POSITIONS.code

  useEffect(() => {
    if (map) {
      vectorSourceRef.current.clear(true)

      if (selectedVesselId && vessel?.lastPositions && vessel?.lastPositions.length > 0) {
        const features = vessel?.lastPositions.map(lastPosition => {
          const geoJSON = new GeoJSON()
          const geometry = geoJSON.readGeometry(lastPosition.geom, {
            dataProjection: WSG84_PROJECTION,
            featureProjection: OPENLAYERS_PROJECTION
          })
          const feature = new Feature({ geometry })
          feature.setId(`${Layers.LAST_POSITIONS.code}:${lastPosition.id}`)
          feature.setProperties({
            ...lastPosition,
            geom: null,
            hasReportings
          })

          return feature
        })

        if (features) {
          vectorSourceRef.current.addFeatures(features)
        }
      }
    }
  }, [hasReportings, map, selectedVesselId, vessel?.lastPositions])

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

export const getSelectedVesselStyle = (feature: FeatureLike, resolution: number) => {
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
