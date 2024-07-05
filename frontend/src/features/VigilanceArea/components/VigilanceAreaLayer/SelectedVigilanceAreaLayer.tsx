import { useGetRegulatoryLayersQuery } from '@api/regulatoryLayersAPI'
import { useGetVigilanceAreasQuery } from '@api/vigilanceAreasAPI'
import { getRegulatoryLayerStyle } from '@features/map/layers/styles/administrativeAndRegulatoryLayers.style'
import { useAppSelector } from '@hooks/useAppSelector'
import { OPENLAYERS_PROJECTION } from '@mtes-mct/monitor-ui'
import { Layers } from 'domain/entities/layers/constants'
import { GeoJSON } from 'ol/format'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { getArea } from 'ol/sphere'
import { useEffect, useMemo, useRef, type MutableRefObject } from 'react'

import { getVigilanceAreaLayerStyle } from './style'
import { getFormattedGeomForFeature, getVigilanceAreaZoneFeature } from './vigilanceAreaGeometryHelper'

import type { BaseMapChildrenProps } from '@features/map/BaseMap'
import type { VectorLayerWithName } from 'domain/types/layer'
import type { Feature } from 'ol'
import type { Geometry } from 'ol/geom'

export function SelectedVigilanceAreaLayer({ map }: BaseMapChildrenProps) {
  const selectedVigilanceAreaId = useAppSelector(state => state.vigilanceArea.selectedVigilanceAreaId)
  const vigilanceAreaGeom = useAppSelector(state => state.vigilanceArea.geometry)
  const layerRegulatoryAreaIds = useAppSelector(state => state.vigilanceArea.layerRegulatoryAreaIds)

  const showedPinnedRegulatoryLayerIds = useAppSelector(state => state.regulatory.showedRegulatoryLayerIds)

  const { vigilanceArea } = useGetVigilanceAreasQuery(undefined, {
    selectFromResult: ({ data }) => ({
      vigilanceArea: data?.find(area => area.id === selectedVigilanceAreaId)
    }),
    skip: !selectedVigilanceAreaId
  })
  const isLayerVisible = !!selectedVigilanceAreaId || !!vigilanceAreaGeom

  const { data: regulatoryLayers } = useGetRegulatoryLayersQuery()

  const regulatoryAreasFeatures = useMemo(() => {
    if (!regulatoryLayers || !vigilanceArea?.linkedRegulatoryAreas) {
      return []
    }

    return vigilanceArea?.linkedRegulatoryAreas.reduce((feats: Feature[], regulatorylayerId) => {
      const regulatorylayer = regulatoryLayers.entities[regulatorylayerId]

      if (
        regulatorylayer &&
        layerRegulatoryAreaIds?.includes(regulatorylayerId) &&
        !showedPinnedRegulatoryLayerIds.includes(regulatorylayerId)
      ) {
        const { geom, ...regulatoryLayerProperties } = regulatorylayer
        const feature = new GeoJSON({
          featureProjection: OPENLAYERS_PROJECTION
        }).readFeature(geom)
        feature.setId(`${Layers.REGULATORY_ENV.code}:${regulatorylayer.id}`)
        const geometry = feature.getGeometry()
        const area = geometry && getArea(geometry)
        feature.setProperties({ area, ...regulatoryLayerProperties })

        feats.push(feature)
      }

      return feats
    }, [])
  }, [regulatoryLayers, vigilanceArea?.linkedRegulatoryAreas, layerRegulatoryAreaIds, showedPinnedRegulatoryLayerIds])

  const vectorSourceRef = useRef(new VectorSource()) as React.MutableRefObject<VectorSource<Feature<Geometry>>>

  const { selectedVigilanceArea } = useGetVigilanceAreasQuery(undefined, {
    selectFromResult: ({ data }) => ({
      selectedVigilanceArea: data?.find(area => area.id === selectedVigilanceAreaId)
    }),
    skip: !selectedVigilanceAreaId
  })

  const vigilanceAreasFeature = useMemo(() => {
    if (vigilanceAreaGeom) {
      return getFormattedGeomForFeature(vigilanceAreaGeom)
    }

    if (selectedVigilanceArea) {
      return getVigilanceAreaZoneFeature(selectedVigilanceArea, Layers.VIGILANCE_AREA.code, true)
    }

    return undefined
  }, [selectedVigilanceArea, vigilanceAreaGeom])

  const vectorLayerRef = useRef(
    new VectorLayer({
      renderBuffer: 7,
      source: vectorSourceRef.current,
      style: getVigilanceAreaLayerStyle,
      updateWhileAnimating: true,
      updateWhileInteracting: true,
      zIndex: Layers.VIGILANCE_AREA.zIndex
    })
  ) as MutableRefObject<VectorLayerWithName>

  ;(vectorLayerRef.current as VectorLayerWithName).name = Layers.VIGILANCE_AREA.code

  const regulatoryAreasVectorSourceRef = useRef(new VectorSource()) as MutableRefObject<VectorSource<Feature<Geometry>>>
  const regulatoryAreasVectorLayerRef = useRef(
    new VectorLayer({
      renderBuffer: 7,
      source: regulatoryAreasVectorSourceRef.current,
      style: getRegulatoryLayerStyle,
      updateWhileAnimating: true,
      updateWhileInteracting: true,
      zIndex: Layers.MISSIONS.zIndex
    })
  ) as MutableRefObject<VectorLayerWithName>
  ;(regulatoryAreasVectorLayerRef.current as VectorLayerWithName).name = Layers.MISSIONS.code

  useEffect(() => {
    map.getLayers().push(vectorLayerRef.current)
    map.getLayers().push(regulatoryAreasVectorLayerRef.current)

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      map.removeLayer(vectorLayerRef.current)
      // eslint-disable-next-line react-hooks/exhaustive-deps
      map.removeLayer(regulatoryAreasVectorLayerRef.current)
    }
  }, [map])

  useEffect(() => {
    vectorSourceRef.current?.clear(true)
    regulatoryAreasVectorSourceRef.current?.clear(true)
    if (vigilanceAreasFeature) {
      vectorSourceRef.current?.addFeature(vigilanceAreasFeature)
    }
    if (regulatoryAreasFeatures) {
      regulatoryAreasVectorSourceRef.current?.addFeatures(regulatoryAreasFeatures)
    }
  }, [vigilanceAreasFeature, regulatoryAreasFeatures])

  useEffect(() => {
    vectorLayerRef.current?.setVisible(isLayerVisible)
    regulatoryAreasVectorLayerRef.current?.setVisible(!!(layerRegulatoryAreaIds && layerRegulatoryAreaIds?.length > 0))
  }, [isLayerVisible, layerRegulatoryAreaIds])

  return null
}
