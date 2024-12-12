import { getDisplayedMetadataAMPLayerId } from '@features/layersSelector/metadataPanel/slice'
import { getIsLinkingRegulatoryToVigilanceArea } from '@features/VigilanceArea/slice'
import { convertToFeature } from 'domain/types/map'
import { Feature } from 'ol'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { type MutableRefObject, useEffect, useMemo, useRef } from 'react'

import { getAMPFeature } from './AMPGeometryHelpers'
import { getAMPLayerStyle } from './AMPLayers.style'
import { useGetAMPsQuery } from '../../../../api/ampsAPI'
import { Layers } from '../../../../domain/entities/layers/constants'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { getIsolatedLayerIsAmp } from '../utils'

import type { BaseMapChildrenProps } from '../../BaseMap'
import type { VectorLayerWithName } from 'domain/types/layer'
import type { Geometry } from 'ol/geom'

export const metadataIsShowedPropertyName = 'metadataIsShowed'

export function AMPPreviewLayer({ currentFeatureOver, map }: BaseMapChildrenProps) {
  const ampMetadataLayerId = useAppSelector(state => getDisplayedMetadataAMPLayerId(state))
  const ampsSearchResult = useAppSelector(state => state.layerSearch.ampsSearchResult)
  const isAmpSearchResultsVisible = useAppSelector(state => state.layerSearch.isAmpSearchResultsVisible)
  const showedAmpLayerIds = useAppSelector(state => state.amp.showedAmpLayerIds)
  const isLinkingRegulatoryToVigilanceArea = useAppSelector(state => getIsLinkingRegulatoryToVigilanceArea(state))

  const isolatedLayer = useAppSelector(state => state.map.isolatedLayer)
  const isolatedLayerTypeIsAmp = getIsolatedLayerIsAmp(isolatedLayer)
  const areLayersFilled = isolatedLayer === undefined

  const { data: ampLayers } = useGetAMPsQuery()
  const { isLayersSidebarVisible } = useAppSelector(state => state.global)

  const isLayerVisible = isLayersSidebarVisible && isAmpSearchResultsVisible && !isLinkingRegulatoryToVigilanceArea

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
          const feature = getAMPFeature({ code: Layers.AMP_PREVIEW.code, isFilled: areLayersFilled, layer })

          if (feature) {
            const metadataIsShowed = layer.id === ampMetadataLayerId
            feature.set(metadataIsShowedPropertyName, metadataIsShowed)
            if (isolatedLayerTypeIsAmp && isolatedLayer?.id === id) {
              feature.set('isFilled', isolatedLayer.isFilled)
            }
            amplayers.push(feature)
          }
        }

        return amplayers
      }, [] as Feature[])
    }

    return ampFeatures
  }, [
    ampLayers?.entities,
    ampLayers?.ids,
    ampMetadataLayerId,
    ampsSearchResult,
    areLayersFilled,
    isolatedLayer,
    isolatedLayerTypeIsAmp,
    showedAmpLayerIds
  ])

  useEffect(() => {
    const vectorSource = ampPreviewVectorSourceRef.current
    vectorSource.clear(true)

    const feature = convertToFeature(currentFeatureOver)

    if (ampLayersFeatures) {
      const isHoveredFeature = feature?.getId()?.toString()?.includes(Layers.AMP_PREVIEW.code)

      if (feature && isHoveredFeature && !areLayersFilled) {
        feature.set('isFilled', true)

        // Exclude the current feature and re-add it with updated properties
        const filteredFeatures = ampLayersFeatures.filter(f => f.getId() !== feature?.getId()) ?? []
        vectorSource.addFeatures([...filteredFeatures, feature])

        return
      }

      vectorSource.addFeatures(ampLayersFeatures)

      return
    }

    if (feature) {
      vectorSource.addFeature(feature)
    }
  }, [ampLayersFeatures, areLayersFilled, currentFeatureOver])

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
