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
import { getIsolatedLayerIsRegulatoryArea } from '../utils'

import type { BaseMapChildrenProps } from '../../BaseMap'
import type { VectorLayerWithName } from 'domain/types/layer'
import type { Geometry } from 'ol/geom'

export const metadataIsShowedPropertyName = 'metadataIsShowed'

export function RegulatoryPreviewLayer({ map }: BaseMapChildrenProps) {
  const regulatoryMetadataLayerId = useAppSelector(state => getDisplayedMetadataRegulatoryLayerId(state))
  const isRegulatorySearchResultsVisible = useAppSelector(state => state.layerSearch.isRegulatorySearchResultsVisible)
  const regulatoryLayersSearchResult = useAppSelector(state => state.layerSearch.regulatoryLayersSearchResult)
  const { data: regulatoryLayers } = useGetRegulatoryLayersQuery()

  const isolatedLayer = useAppSelector(state => state.map.isolatedLayer)
  const isolatedLayerTypeIsRegulatory = getIsolatedLayerIsRegulatoryArea(isolatedLayer)

  const isLinkingAMPToVigilanceArea = useAppSelector(state => getIsLinkingAMPToVigilanceArea(state))

  const isLayersSidebarVisible = useAppSelector(state => state.global.isLayersSidebarVisible)
  const isLayerVisible = isLayersSidebarVisible && isRegulatorySearchResultsVisible && !isLinkingAMPToVigilanceArea

  const areLayersFilled = isolatedLayer === undefined
  const regulatoryPreviewVectorSourceRef = useRef(new VectorSource()) as MutableRefObject<
    VectorSource<Feature<Geometry>>
  >
  const regulatoryPreviewVectorLayerRef = useRef(
    new VectorLayer({
      renderBuffer: 4,
      renderOrder: (a, b) => b.get('area') - a.get('area'),
      source: regulatoryPreviewVectorSourceRef.current,
      style: getRegulatoryLayerStyle
    })
  ) as MutableRefObject<VectorLayerWithName>
  regulatoryPreviewVectorLayerRef.current.name = Layers.REGULATORY_ENV_PREVIEW.code

  const regulatoryLayersFeatures = useMemo(() => {
    let regulatoryFeatures: Feature[] = []
    if (regulatoryLayersSearchResult || regulatoryLayers?.ids) {
      const regulatoryAreasToDisplay = regulatoryLayersSearchResult ?? regulatoryLayers?.ids ?? []

      regulatoryFeatures = regulatoryAreasToDisplay?.reduce((regulatorylayers, id) => {
        const layer = regulatoryLayers?.entities[id]

        if (layer && layer.geom) {
          const feature = getRegulatoryFeature({
            code: Layers.REGULATORY_ENV_PREVIEW.code,
            isFilled: areLayersFilled,
            layer
          })

          if (feature) {
            const metadataIsShowed = layer.id === regulatoryMetadataLayerId
            feature.set(metadataIsShowedPropertyName, metadataIsShowed)

            if (isolatedLayerTypeIsRegulatory && isolatedLayer?.id === id) {
              feature.set('isFilled', true)
            }
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
    areLayersFilled,
    regulatoryMetadataLayerId,
    isolatedLayerTypeIsRegulatory,
    isolatedLayer?.id
  ])

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
