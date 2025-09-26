import { getDisplayedMetadataRegulatoryLayerId } from '@features/layersSelector/metadataPanel/slice'
import { getIsLinkingAMPToVigilanceArea } from '@features/VigilanceArea/slice'
import { displayTags } from '@utils/getTagsAsOptions'
import { Feature } from 'ol'
import VectorLayer from 'ol/layer/Vector'
import WebGLVectorLayer from 'ol/layer/WebGLVector'
import VectorSource from 'ol/source/Vector'
import { Fill, Style } from 'ol/style'
import { type MutableRefObject, useEffect, useMemo, useRef } from 'react'

import { getRegulatoryFeatureFromLayer } from './regulatoryGeometryHelpers'
import { useGetRegulatoryLayersQuery } from '../../../../api/regulatoryLayersAPI'
import { Layers } from '../../../../domain/entities/layers/constants'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { getRegulatoryEnvColorWithAlpha, regulatoryStyle } from '../styles/administrativeAndRegulatoryLayers.style'

import type { BaseMapChildrenProps } from '../../BaseMap'
import type { VectorLayerWithName, WebGLVectorLayerWithName } from 'domain/types/layer'
import type { Geometry } from 'ol/geom'

export const metadataIsShowedPropertyName = 'metadataIsShowed'

export function RegulatoryPreviewLayer({ map }: BaseMapChildrenProps) {
  const regulatoryMetadataLayerId = useAppSelector(state => getDisplayedMetadataRegulatoryLayerId(state))
  const isRegulatorySearchResultsVisible = useAppSelector(state => state.layerSearch.isRegulatorySearchResultsVisible)
  const regulatoryLayersSearchResult = useAppSelector(state => state.layerSearch.regulatoryLayersSearchResult)
  const { data: regulatoryLayers } = useGetRegulatoryLayersQuery()

  const isolatedLayer = useAppSelector(state => state.map.isolatedLayer)

  const isLinkingAMPToVigilanceArea = useAppSelector(state => getIsLinkingAMPToVigilanceArea(state))

  const isLayersSidebarVisible = useAppSelector(state => state.global.visibility.isLayersSidebarVisible)
  const isLayerVisible = isLayersSidebarVisible && isRegulatorySearchResultsVisible && !isLinkingAMPToVigilanceArea

  const regulatoryPreviewVectorSourceRef = useRef(new VectorSource()) as MutableRefObject<
    VectorSource<Feature<Geometry>>
  >
  const regulatoryPreviewVectorLayerRef = useRef(
    new WebGLVectorLayer({
      source: regulatoryPreviewVectorSourceRef.current,
      style: regulatoryStyle
    })
  ) as MutableRefObject<WebGLVectorLayerWithName>
  regulatoryPreviewVectorLayerRef.current.name = `${Layers.REGULATORY_ENV_PREVIEW.code}-2`

  const pickingStyle = new Style({
    fill: new Fill({ color: 'transparent' })
  })

  const pickingLayer = useRef(
    new VectorLayer({
      renderBuffer: 4,
      renderOrder: (a, b) => b.get('area') - a.get('area'),
      source: regulatoryPreviewVectorSourceRef.current,
      style: pickingStyle
    })
  ) as MutableRefObject<VectorLayerWithName>
  pickingLayer.current.name = Layers.REGULATORY_ENV_PREVIEW.code

  const regulatoryLayersFeatures = useMemo(() => {
    let regulatoryFeatures: Feature[] = []
    if (regulatoryLayersSearchResult || regulatoryLayers?.ids) {
      const regulatoryAreasToDisplay = regulatoryLayersSearchResult ?? regulatoryLayers?.ids ?? []

      regulatoryFeatures = regulatoryAreasToDisplay?.reduce((regulatorylayers, id) => {
        const layer = regulatoryLayers?.entities[id]

        if (layer && layer.geom) {
          const feature = getRegulatoryFeatureFromLayer({
            code: Layers.REGULATORY_ENV_PREVIEW.code,
            color: getRegulatoryEnvColorWithAlpha(displayTags(layer.tags), layer.entityName),
            isolatedLayer,
            layer
          })

          if (feature) {
            const metadataIsShowed = layer.id === regulatoryMetadataLayerId
            feature.set(metadataIsShowedPropertyName, metadataIsShowed)

            regulatorylayers.push(feature)
          }
        }

        return regulatorylayers
      }, [] as Feature[])
    }

    return regulatoryFeatures
  }, [
    regulatoryLayersSearchResult,
    regulatoryLayers?.ids,
    regulatoryLayers?.entities,
    regulatoryMetadataLayerId,
    isolatedLayer
  ])

  useEffect(() => {
    regulatoryPreviewVectorSourceRef.current?.clear(true)

    if (regulatoryLayersFeatures) {
      const sortedFeatures = regulatoryLayersFeatures.sort((a, b) => (b.get('area') ?? 0) - (a.get('area') ?? 0))

      regulatoryPreviewVectorSourceRef.current?.addFeatures(sortedFeatures)
    }
  }, [regulatoryLayersFeatures])

  useEffect(() => {
    if (map) {
      regulatoryPreviewVectorLayerRef.current?.setVisible(isLayerVisible)
      pickingLayer.current?.setVisible(isLayerVisible)
    }
  }, [map, isLayerVisible])

  useEffect(() => {
    if (map) {
      map.getLayers().push(regulatoryPreviewVectorLayerRef.current)
      map.getLayers().push(pickingLayer.current)

      return () => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        map.removeLayer(regulatoryPreviewVectorLayerRef.current)
        // eslint-disable-next-line react-hooks/exhaustive-deps
        map.removeLayer(pickingLayer.current)
      }
    }

    return () => {}
  }, [map])

  return null
}
