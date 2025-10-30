import { getDisplayedMetadataAMPLayerId } from '@features/layersSelector/metadataPanel/slice'
import { getIsLinkingRegulatoryToVigilanceArea } from '@features/VigilanceArea/slice'
import { Feature } from 'ol'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { type MutableRefObject, useEffect, useMemo, useRef } from 'react'

import { getAMPFeature } from './AMPGeometryHelpers'
import { getAMPLayerStyle } from './AMPLayers.style'
import { useGetAMPsQuery } from '../../../../api/ampsAPI'
import { Layers } from '../../../../domain/entities/layers/constants'
import { useAppSelector } from '../../../../hooks/useAppSelector'

import type { BaseMapChildrenProps } from '../../BaseMap'
import type { VectorLayerWithName } from 'domain/types/layer'
import type { Geometry } from 'ol/geom'

export const metadataIsShowedPropertyName = 'metadataIsShowed'

export function AMPPreviewLayer({ map }: BaseMapChildrenProps) {
  const ampMetadataLayerId = useAppSelector(state => getDisplayedMetadataAMPLayerId(state))
  const ampsSearchResult = useAppSelector(state => state.layerSearch.ampsSearchResult)
  const isAmpSearchResultsVisible = useAppSelector(state => state.layerSearch.isAmpSearchResultsVisible)
  const showedAmpLayerIds = useAppSelector(state => state.amp.showedAmpLayerIds)
  const isLinkingRegulatoryToVigilanceArea = useAppSelector(state => getIsLinkingRegulatoryToVigilanceArea(state))

  const isolatedLayer = useAppSelector(state => state.map.isolatedLayer)
  const { isLayersSidebarVisible } = useAppSelector(state => state.global.visibility)

  const isLayerVisible = isLayersSidebarVisible && isAmpSearchResultsVisible && !isLinkingRegulatoryToVigilanceArea
  const { bbox, zoom } = useAppSelector(state => state.map.mapView)

  const { data: ampLayers } = useGetAMPsQuery(
    {
      bbox,
      withGeometry: isLayerVisible,
      zoom
    },
    { skip: !isLayerVisible }
  )

  const ampPreviewVectorSourceRef = useRef(new VectorSource()) as MutableRefObject<VectorSource<Feature<Geometry>>>
  const ampPreviewVectorLayerRef = useRef(
    new VectorLayer({
      renderBuffer: 4,
      renderOrder: (a, b) => b.get('area') - a.get('area'),
      source: ampPreviewVectorSourceRef.current,
      style: getAMPLayerStyle
    })
  ) as MutableRefObject<VectorLayerWithName>
  ampPreviewVectorLayerRef.current.name = Layers.AMP_PREVIEW.code

  const ampLayersFeatures = useMemo(() => {
    let ampFeatures: Feature[] = []

    if (ampsSearchResult || ampLayers?.entities) {
      const ampsToDisplay = ampsSearchResult ?? ampLayers?.ids ?? []

      ampFeatures = ampsToDisplay.reduce((amplayers, id) => {
        if (showedAmpLayerIds.includes(id)) {
          return amplayers
        }
        const layer = ampLayers?.entities[id]

        if (layer && layer.geom) {
          const feature = getAMPFeature({ code: Layers.AMP_PREVIEW.code, isolatedLayer, layer })

          if (feature) {
            const metadataIsShowed = layer.id === ampMetadataLayerId
            feature.set(metadataIsShowedPropertyName, metadataIsShowed)

            amplayers.push(feature)
          }
        }

        return amplayers
      }, [] as Feature[])
    }

    return ampFeatures
  }, [ampLayers?.entities, ampLayers?.ids, ampMetadataLayerId, ampsSearchResult, isolatedLayer, showedAmpLayerIds])

  useEffect(() => {
    ampPreviewVectorSourceRef.current?.clear(true)

    if (ampLayersFeatures) {
      ampPreviewVectorSourceRef.current?.addFeatures(ampLayersFeatures)
    }
  }, [ampLayersFeatures])

  useEffect(() => {
    ampPreviewVectorLayerRef.current?.setVisible(isLayerVisible)
  }, [isLayerVisible])

  useEffect(() => {
    if (map) {
      map.getLayers().push(ampPreviewVectorLayerRef.current)
    }

    return () => {
      if (map) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        map.removeLayer(ampPreviewVectorLayerRef.current)
      }
    }
  }, [map])

  return null
}
