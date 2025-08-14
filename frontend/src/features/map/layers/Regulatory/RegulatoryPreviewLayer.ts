import { getDisplayedMetadataRegulatoryLayerId } from '@features/layersSelector/metadataPanel/slice'
import { getIsLinkingAMPToVigilanceArea } from '@features/VigilanceArea/slice'
import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '@mtes-mct/monitor-ui'
import { useMapContext } from 'context/map/MapContext'
import { Feature } from 'ol'
import { intersects } from 'ol/extent'
import VectorLayer from 'ol/layer/Vector'
import { transformExtent } from 'ol/proj'
import VectorSource from 'ol/source/Vector'
import { type MutableRefObject, memo, useEffect, useMemo, useRef } from 'react'

import { getRegulatoryFeature } from './regulatoryGeometryHelpers'
import { useGetRegulatoryLayersQuery } from '../../../../api/regulatoryLayersAPI'
import { Layers } from '../../../../domain/entities/layers/constants'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { getRegulatoryLayerStyle } from '../styles/administrativeAndRegulatoryLayers.style'

import type { VectorLayerWithName } from 'domain/types/layer'
import type { Geometry } from 'ol/geom'

export const metadataIsShowedPropertyName = 'metadataIsShowed'

export const RegulatoryPreviewLayer = memo(() => {
  const { map } = useMapContext()
  const regulatoryMetadataLayerId = useAppSelector(state => getDisplayedMetadataRegulatoryLayerId(state))
  const isRegulatorySearchResultsVisible = useAppSelector(state => state.layerSearch.isRegulatorySearchResultsVisible)
  const regulatoryLayersSearchResult = useAppSelector(state => state.layerSearch.regulatoryLayersSearchResult)
  const currentMapExtentTracker = useAppSelector(state => state.map.currentMapExtentTracker)
  const isolatedLayer = useAppSelector(state => state.map.isolatedLayer)

  const isLinkingAMPToVigilanceArea = useAppSelector(state => getIsLinkingAMPToVigilanceArea(state))

  const { data: regulatoryLayers } = useGetRegulatoryLayersQuery()

  const isLayersSidebarVisible = useAppSelector(state => state.global.visibility.isLayersSidebarVisible)
  const isLayerVisible = isLayersSidebarVisible && isRegulatorySearchResultsVisible && !isLinkingAMPToVigilanceArea

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
    if (!isLayerVisible || !currentMapExtentTracker) {
      return regulatoryFeatures
    }

    if (regulatoryLayersSearchResult || regulatoryLayers?.ids) {
      const regulatoryAreasToDisplay = regulatoryLayersSearchResult ?? regulatoryLayers?.ids ?? []

      regulatoryFeatures = regulatoryAreasToDisplay?.reduce((regulatorylayers, id) => {
        const layer = regulatoryLayers?.entities[id]
        const currentExtent = transformExtent(currentMapExtentTracker, OPENLAYERS_PROJECTION, WSG84_PROJECTION)
        const layerBbox = layer?.bbox
        const isIntersecting = layerBbox && intersects(layerBbox, currentExtent)

        if (layer && layer.geom && isIntersecting) {
          const feature = getRegulatoryFeature({
            code: Layers.REGULATORY_ENV_PREVIEW.code,
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
    isLayerVisible,
    currentMapExtentTracker,
    regulatoryLayersSearchResult,
    regulatoryLayers?.ids,
    regulatoryLayers?.entities,
    isolatedLayer,
    regulatoryMetadataLayerId
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
})
