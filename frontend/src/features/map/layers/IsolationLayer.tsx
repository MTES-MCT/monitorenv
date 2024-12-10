import { useGetAMPsQuery } from '@api/ampsAPI'
import { useGetVigilanceAreasQuery } from '@api/vigilanceAreasAPI'
import { getIsolatedVigilanceAreaLayerStyle } from '@features/VigilanceArea/components/VigilanceAreaLayer/style'
import { getVigilanceAreaZoneFeature } from '@features/VigilanceArea/components/VigilanceAreaLayer/vigilanceAreaGeometryHelper'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { type MutableRefObject, useEffect, useMemo, useRef } from 'react'

import { getAMPFeature } from './AMP/AMPGeometryHelpers'
import { getIsolateAMPLayerStyle } from './AMP/AMPLayers.style'
import { getRegulatoryFeature } from './Regulatory/regulatoryGeometryHelpers'
import { getIsolateRegulatoryLayerStyle } from './styles/administrativeAndRegulatoryLayers.style'
import { useGetRegulatoryLayersQuery } from '../../../api/regulatoryLayersAPI'
import { TWO_MINUTES } from '../../../constants'
import { Layers } from '../../../domain/entities/layers/constants'
import { useAppSelector } from '../../../hooks/useAppSelector'

import type { BaseMapChildrenProps } from '../BaseMap'
import type { VectorLayerWithName } from 'domain/types/layer'
import type { Feature } from 'ol'
import type { Geometry } from 'ol/geom'

export const metadataIsShowedPropertyName = 'metadataIsShowed'

export function IsolationLayer({ map }: BaseMapChildrenProps) {
  const { data: regulatoryLayers } = useGetRegulatoryLayersQuery()
  const { data: ampLayers } = useGetAMPsQuery()
  const { data: vigilanceAreas } = useGetVigilanceAreasQuery(undefined, { pollingInterval: TWO_MINUTES })

  const isolatedLayer = useAppSelector(state => state.map.isolatedLayer)
  const excludedLayers = useAppSelector(state => state.map.excludedLayers)
  const isLayerVisible = !!isolatedLayer?.id

  const isolateLayerVectorSourceRef = useRef(new VectorSource()) as MutableRefObject<VectorSource<Feature<Geometry>>>
  const isolateLayerVectorLayerRef = useRef(
    new VectorLayer({
      renderBuffer: 4,
      renderOrder: (a, b) => b.get('area') - a.get('area'),
      source: isolateLayerVectorSourceRef.current
    })
  ) as MutableRefObject<VectorLayerWithName>
  isolateLayerVectorLayerRef.current.name = Layers.ISOLATED_LAYERS.code

  const regulatoryLayersFeatures = useMemo(() => {
    let regulatoryFeatures: Feature[] = []
    if (regulatoryLayers?.entities) {
      const isolatedLayerTypeIsRegulatory = (isolatedLayer?.type.search('REGULATORY') ?? -1) > -1
      const regulatoryExcludedLayers =
        excludedLayers?.filter(layer => layer.type.search('REGULATORY') > -1).map(layer => layer.id) ?? []

      let featuresToDisplay = regulatoryExcludedLayers ?? []
      if (isolatedLayerTypeIsRegulatory && isolatedLayer?.id) {
        featuresToDisplay = [...featuresToDisplay, isolatedLayer.id]
      }

      regulatoryFeatures = featuresToDisplay.reduce((feats: Feature[], regulatorylayer) => {
        const layer = regulatorylayer ? regulatoryLayers.entities[regulatorylayer] : undefined
        if (layer) {
          const feature = getRegulatoryFeature({ code: Layers.REGULATORY_ENV.code, layer })
          const featureIsFilled =
            isolatedLayerTypeIsRegulatory && isolatedLayer?.id === regulatorylayer && isolatedLayer?.isFilled

          if (feature) {
            feature.setStyle(getIsolateRegulatoryLayerStyle(feature, regulatoryExcludedLayers, featureIsFilled))
            feats.push(feature)
          }
        }

        return feats
      }, [])
    }

    return regulatoryFeatures
  }, [regulatoryLayers, isolatedLayer, excludedLayers])

  const ampLayersFeatures = useMemo(() => {
    let ampFeatures: Feature[] = []

    if (ampLayers?.entities) {
      const isolatedLayerTypeIsAmp = (isolatedLayer?.type.search('AMP') ?? -1) > -1
      const ampExcludedLayers =
        excludedLayers?.filter(layer => (layer.type.search('AMP') ?? -1) > -1).map(layer => layer.id) ?? []
      let featuresToDisplay = ampExcludedLayers ?? []
      if (isolatedLayerTypeIsAmp && isolatedLayer?.id) {
        featuresToDisplay = [...featuresToDisplay, isolatedLayer.id]
      }

      ampFeatures = featuresToDisplay.reduce((amplayers, id) => {
        const layer = id ? ampLayers?.entities[id] : undefined

        if (layer && layer.geom) {
          const feature = getAMPFeature({ code: Layers.AMP_PREVIEW.code, layer })
          const featureIsFilled = isolatedLayerTypeIsAmp && isolatedLayer?.id === id && isolatedLayer?.isFilled

          if (feature) {
            feature.setStyle(getIsolateAMPLayerStyle(feature, ampExcludedLayers, featureIsFilled))
            amplayers.push(feature)
          }
        }

        return amplayers
      }, [] as Feature[])
    }

    return ampFeatures
  }, [ampLayers?.entities, excludedLayers, isolatedLayer])

  const vigilanceAreasLayersFeatures = useMemo(() => {
    let vigilanceAreasFeatures: Feature[] = []
    // console.log('vigilanceAreas?.entities', vigilanceAreas?.entities)
    if (vigilanceAreas?.entities) {
      const isolatedLayerIsVigilanceArea = (isolatedLayer?.type.search('VIGILANCE_AREA') ?? -1) > -1
      const vigilanceAreasExcludedLayers = excludedLayers
        ?.filter(layer => (layer.type.search('VIGILANCE_AREA') ?? -1) > -1)
        .map(layer => layer.id)

      let featuresToDisplay = vigilanceAreasExcludedLayers ?? []
      if (isolatedLayerIsVigilanceArea && isolatedLayer?.id) {
        featuresToDisplay = [...featuresToDisplay, isolatedLayer.id]
      }
      vigilanceAreasFeatures = featuresToDisplay.reduce((vigilanceAreasLayers, id) => {
        const layer = id ? vigilanceAreas?.entities[id] : undefined
        if (layer && layer.geom) {
          const feature = getVigilanceAreaZoneFeature(layer, Layers.VIGILANCE_AREA.code)
          const featureIsFilled = isolatedLayerIsVigilanceArea && isolatedLayer?.id === id && isolatedLayer?.isFilled
          if (feature) {
            feature.setStyle(getIsolatedVigilanceAreaLayerStyle(feature, vigilanceAreasExcludedLayers, featureIsFilled))
            vigilanceAreasLayers.push(feature)
          }
        }

        return vigilanceAreasLayers
      }, [] as Feature[])
    }

    return vigilanceAreasFeatures
  }, [excludedLayers, isolatedLayer, vigilanceAreas?.entities])

  useEffect(() => {
    isolateLayerVectorSourceRef.current?.clear(true)
    if (regulatoryLayersFeatures) {
      isolateLayerVectorSourceRef.current?.addFeatures(regulatoryLayersFeatures)
    }
    if (ampLayersFeatures) {
      isolateLayerVectorSourceRef.current?.addFeatures(ampLayersFeatures)
    }

    if (vigilanceAreasLayersFeatures) {
      isolateLayerVectorSourceRef.current?.addFeatures(vigilanceAreasLayersFeatures)
    }
  }, [regulatoryLayersFeatures, ampLayersFeatures, vigilanceAreasLayersFeatures])

  useEffect(() => {
    if (map) {
      map.getLayers().push(isolateLayerVectorLayerRef.current)
    }

    return () => {
      if (map) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        map.removeLayer(isolateLayerVectorLayerRef.current)
      }
    }
  }, [map])

  useEffect(() => {
    isolateLayerVectorLayerRef.current?.setVisible(isLayerVisible)
  }, [isLayerVisible])

  return null
}
