import { useGetLocalizedAreasQuery } from '@api/localizedAreasAPI'
import { useAppSelector } from '@hooks/useAppSelector'
import { useHasMapInteraction } from '@hooks/useHasMapInteraction'
import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '@mtes-mct/monitor-ui'
import { Layers } from 'domain/entities/layers/constants'
import { Feature } from 'ol'
import { GeoJSON } from 'ol/format'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { getArea } from 'ol/sphere'
import { useEffect, useRef, type MutableRefObject } from 'react'

import { localizedAreaStyle } from './style'

import type { LocalizedArea } from '@features/LocalizedArea/types'
import type { BaseMapChildrenProps } from '@features/map/BaseMap'
import type { VectorLayerWithName } from 'domain/types/layer'
import type { Geometry } from 'ol/geom'

const getLocalizedAreaZoneFeature = (localizedArea: LocalizedArea.LocalizedArea) => {
  const geoJSON = new GeoJSON()
  const geometry = geoJSON.readGeometry(localizedArea.geom, {
    dataProjection: WSG84_PROJECTION,
    featureProjection: OPENLAYERS_PROJECTION
  })
  const area = geometry && getArea(geometry)

  const feature = new Feature({
    geometry
  })

  feature.setId(`${Layers.LOCALIZED_AREAS.code}:${localizedArea.id}`)
  feature.setProperties({
    area,
    ...localizedArea
  })

  return feature
}

export function LocalizedAreasLayer({ map }: BaseMapChildrenProps) {
  const { showedLocalizedAreaLayerIds } = useAppSelector(state => state.localizedArea)
  const hasMapInteraction = useHasMapInteraction()
  const isLayerVisible = !hasMapInteraction

  const { data: localizedAreas } = useGetLocalizedAreasQuery()

  const localizedAreasVectorSourceRef = useRef(new VectorSource()) as MutableRefObject<VectorSource<Feature<Geometry>>>
  const localizedAreasVectorLayerRef = useRef(
    new VectorLayer({
      renderBuffer: 7,
      renderOrder: (a, b) => b.get('area') - a.get('area'),
      source: localizedAreasVectorSourceRef.current,
      style: localizedAreaStyle,
      zIndex: Layers.LOCALIZED_AREAS.zIndex
    })
  ) as MutableRefObject<VectorLayerWithName>
  localizedAreasVectorLayerRef.current.name = Layers.LOCALIZED_AREAS.code

  useEffect(() => {
    if (map) {
      map.getLayers().push(localizedAreasVectorLayerRef.current)

      // eslint-disable-next-line react-hooks/exhaustive-deps
      return () => map.removeLayer(localizedAreasVectorLayerRef.current)
    }

    return () => {}
  }, [map])

  useEffect(() => {
    localizedAreasVectorSourceRef.current?.clear(true)
    let filteredLocalizedAreas: Feature[] = []
    if (localizedAreas?.entities) {
      filteredLocalizedAreas = showedLocalizedAreaLayerIds.reduce((feats: Feature[], localizedAreaId) => {
        const localizedArealayer = localizedAreas.entities?.[localizedAreaId]
        if (localizedArealayer) {
          const feature = getLocalizedAreaZoneFeature(localizedArealayer)
          feats.push(feature)
        }

        return feats
      }, [])
    }
    localizedAreasVectorSourceRef.current?.addFeatures(filteredLocalizedAreas)
  }, [localizedAreas, showedLocalizedAreaLayerIds])

  useEffect(() => {
    localizedAreasVectorLayerRef.current?.setVisible(isLayerVisible)
  }, [isLayerVisible])

  return null
}
