import { getDisplayedMetadataRegulatoryLayerId } from '@features/layersSelector/metadataPanel/slice'
import { getIsLinkingAMPToVigilanceArea } from '@features/VigilanceArea/slice'
import { Feature } from 'ol'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { type MutableRefObject, useEffect, useMemo, useRef } from 'react'

import { getRegulatoryFeature } from './regulatoryGeometryHelpers'
import { useGetRegulatoryLayersQuery } from '../../../../api/regulatoryLayersAPI'
import { Layers } from '../../../../domain/entities/layers/constants'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { getRegulatoryLayerStyle } from '../styles/administrativeAndRegulatoryLayers.style'

import type { BaseMapChildrenProps } from '../../BaseMap'
import type { VectorLayerWithName } from 'domain/types/layer'
import type { Geometry } from 'ol/geom'

export const metadataIsShowedPropertyName = 'metadataIsShowed'

export function RegulatoryPreviewLayer({ map }: BaseMapChildrenProps) {
  const regulatoryMetadataLayerId = useAppSelector(state => getDisplayedMetadataRegulatoryLayerId(state))
  const isRegulatorySearchResultsVisible = useAppSelector(state => state.layerSearch.isRegulatorySearchResultsVisible)
  const regulatoryLayersSearchResult = useAppSelector(state => state.layerSearch.regulatoryLayersSearchResult)
  const { data: regulatoryLayers } = useGetRegulatoryLayersQuery()

  const isLinkingAMPToVigilanceArea = useAppSelector(state => getIsLinkingAMPToVigilanceArea(state))

  const isLayersSidebarVisible = useAppSelector(state => state.global.isLayersSidebarVisible)
  const isLayerVisible = isLayersSidebarVisible && isRegulatorySearchResultsVisible && !isLinkingAMPToVigilanceArea

  const regulatoryPreviewVectorSourceRef = useRef(new VectorSource()) as MutableRefObject<
    VectorSource<Feature<Geometry>>
  >
  const regulatoryPreviewVectorLayerRef = useRef(
    new VectorLayer({
      renderBuffer: 4,
      renderOrder: (a, b) => b.get('area') - a.get('area'),
      source: regulatoryPreviewVectorSourceRef.current,
      style: getRegulatoryLayerStyle,
      updateWhileAnimating: true,
      updateWhileInteracting: true
    })
  ) as MutableRefObject<VectorLayerWithName>
  ;(regulatoryPreviewVectorLayerRef.current as VectorLayerWithName).name = Layers.REGULATORY_ENV_PREVIEW.code

  const regulatoryLayersFeatures = useMemo(() => {
    let regulatoryFeatures: Feature[] = []
    if (regulatoryLayersSearchResult) {
      regulatoryFeatures = regulatoryLayersSearchResult.reduce((regulatorylayers, id) => {
        const layer = regulatoryLayers?.entities[id]

        if (layer && layer.geom) {
          const feature = getRegulatoryFeature({ code: Layers.REGULATORY_ENV_PREVIEW.code, layer })

          if (feature) {
            const metadataIsShowed = layer.id === regulatoryMetadataLayerId
            feature.set(metadataIsShowedPropertyName, metadataIsShowed)
          }
          regulatorylayers.push(feature)
        }

        return regulatorylayers
      }, [] as Feature[])
    }

    return regulatoryFeatures
  }, [regulatoryLayers, regulatoryMetadataLayerId, regulatoryLayersSearchResult])

  useEffect(() => {
    regulatoryPreviewVectorSourceRef.current?.clear(true)
    if (regulatoryLayersFeatures) {
      regulatoryPreviewVectorSourceRef.current?.addFeatures(regulatoryLayersFeatures)
    }
  }, [regulatoryLayersFeatures])

  useEffect(() => {
    if (map) {
      regulatoryPreviewVectorLayerRef.current?.setVisible(isLayerVisible)
    }
  }, [map, isLayerVisible])

  useEffect(() => {
    if (map) {
      map.getLayers().push(regulatoryPreviewVectorLayerRef.current)

      return () => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        map.removeLayer(regulatoryPreviewVectorLayerRef.current)
      }
    }

    return () => {}
  }, [map])

  return null
}
