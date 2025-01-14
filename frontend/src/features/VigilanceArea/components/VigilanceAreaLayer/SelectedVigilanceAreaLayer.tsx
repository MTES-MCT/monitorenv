import { useGetAMPsQuery } from '@api/ampsAPI'
import { useGetRegulatoryLayersQuery } from '@api/regulatoryLayersAPI'
import { useGetVigilanceAreasQuery } from '@api/vigilanceAreasAPI'
import { getAMPFeature } from '@features/map/layers/AMP/AMPGeometryHelpers'
import { getAMPLayerStyle } from '@features/map/layers/AMP/AMPLayers.style'
import { getRegulatoryFeature } from '@features/map/layers/Regulatory/regulatoryGeometryHelpers'
import { getRegulatoryLayerStyle } from '@features/map/layers/styles/administrativeAndRegulatoryLayers.style'
import { useAppSelector } from '@hooks/useAppSelector'
import { Layers } from 'domain/entities/layers/constants'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { useEffect, useMemo, useRef, type MutableRefObject } from 'react'

import { getVigilanceAreaLayerStyle } from './style'
import { getVigilanceAreaZoneFeature } from './vigilanceAreaGeometryHelper'

import type { BaseMapChildrenProps } from '@features/map/BaseMap'
import type { VectorLayerWithName } from 'domain/types/layer'
import type { Feature } from 'ol'
import type { Geometry } from 'ol/geom'

export function SelectedVigilanceAreaLayer({ map }: BaseMapChildrenProps) {
  const selectedVigilanceAreaId = useAppSelector(state => state.vigilanceArea.selectedVigilanceAreaId)
  const editingVigilanceAreaId = useAppSelector(state => state.vigilanceArea.editingVigilanceAreaId)

  const { selectedVigilanceArea } = useGetVigilanceAreasQuery(undefined, {
    selectFromResult: ({ data }) => ({
      selectedVigilanceArea: selectedVigilanceAreaId ? data?.entities[selectedVigilanceAreaId] : undefined
    }),
    skip: !selectedVigilanceAreaId
  })

  const isolatedLayer = useAppSelector(state => state.map.isolatedLayer)

  const isLayerVisible = !!selectedVigilanceAreaId && selectedVigilanceAreaId !== editingVigilanceAreaId

  // Vigilance Area
  const vigilanceAreasFeature = useMemo(() => {
    if (selectedVigilanceArea) {
      return getVigilanceAreaZoneFeature(selectedVigilanceArea, Layers.VIGILANCE_AREA.code, isolatedLayer, true)
    }

    return undefined
  }, [selectedVigilanceArea, isolatedLayer])

  const vectorSourceRef = useRef(new VectorSource()) as React.MutableRefObject<VectorSource<Feature<Geometry>>>
  const vectorLayerRef = useRef(
    new VectorLayer({
      renderBuffer: 7,
      source: vectorSourceRef.current,
      style: getVigilanceAreaLayerStyle,
      zIndex: Layers.VIGILANCE_AREA.zIndex
    })
  ) as MutableRefObject<VectorLayerWithName>

  vectorLayerRef.current.name = Layers.VIGILANCE_AREA.code

  // Regulatory Areas Layers
  const regulatoryAreaIdsToBeDisplayed = useAppSelector(state => state.vigilanceArea.regulatoryAreaIdsToBeDisplayed)
  const showedPinnedRegulatoryLayerIds = useAppSelector(state => state.regulatory.showedRegulatoryLayerIds)

  const isRegulatoryLayerVisible =
    !!(regulatoryAreaIdsToBeDisplayed && regulatoryAreaIdsToBeDisplayed?.length > 0) &&
    !!selectedVigilanceAreaId &&
    isLayerVisible

  const { data: regulatoryLayers } = useGetRegulatoryLayersQuery()

  const regulatoryAreasFeatures = useMemo(() => {
    const linkedRegulatoryAreas = selectedVigilanceArea?.linkedRegulatoryAreas ?? []
    if (!regulatoryLayers || linkedRegulatoryAreas.length === 0) {
      return []
    }

    return linkedRegulatoryAreas.reduce((feats: Feature[], regulatorylayerId) => {
      const regulatorylayer = regulatoryLayers.entities[regulatorylayerId]
      const isRegulatoryAreaShouldBeDisplayed =
        regulatoryAreaIdsToBeDisplayed?.includes(regulatorylayerId) &&
        !showedPinnedRegulatoryLayerIds.includes(regulatorylayerId)

      if (regulatorylayer && isRegulatoryAreaShouldBeDisplayed) {
        const feature = getRegulatoryFeature({
          code: Layers.REGULATORY_AREAS_LINKED_TO_VIGILANCE_AREA.code,
          isolatedLayer,
          layer: regulatorylayer
        })

        if (!feature) {
          return feats
        }
        feats.push(feature)
      }

      return feats
    }, [])
  }, [
    selectedVigilanceArea?.linkedRegulatoryAreas,
    regulatoryLayers,
    regulatoryAreaIdsToBeDisplayed,
    showedPinnedRegulatoryLayerIds,
    isolatedLayer
  ])

  const regulatoryAreasVectorSourceRef = useRef(new VectorSource()) as MutableRefObject<VectorSource<Feature<Geometry>>>
  const regulatoryAreasVectorLayerRef = useRef(
    new VectorLayer({
      renderBuffer: 7,
      source: regulatoryAreasVectorSourceRef.current,
      style: getRegulatoryLayerStyle,
      zIndex: Layers.REGULATORY_AREAS_LINKED_TO_VIGILANCE_AREA.zIndex
    })
  ) as MutableRefObject<VectorLayerWithName>
  regulatoryAreasVectorLayerRef.current.name = Layers.REGULATORY_AREAS_LINKED_TO_VIGILANCE_AREA.code

  // AMP Layer
  const ampIdsToBeDisplayed = useAppSelector(state => state.vigilanceArea.ampIdsToBeDisplayed)
  const showedPinnedAMPLayerIds = useAppSelector(state => state.amp.showedAmpLayerIds)

  const isAMPLayerVisible =
    !!(ampIdsToBeDisplayed && ampIdsToBeDisplayed?.length > 0) && !!selectedVigilanceAreaId && isLayerVisible
  const { data: ampLayers } = useGetAMPsQuery()
  const ampFeatures = useMemo(() => {
    const linkedAMPs = selectedVigilanceArea?.linkedAMPs ?? []
    if (!ampLayers || linkedAMPs.length === 0) {
      return []
    }

    return linkedAMPs.reduce((feats: Feature[], AMPLayerId) => {
      const AMPlayer = ampLayers.entities[AMPLayerId]
      const isAMPShouldBeDisplayed =
        ampIdsToBeDisplayed?.includes(AMPLayerId) && !showedPinnedAMPLayerIds.includes(AMPLayerId)

      if (AMPlayer && isAMPShouldBeDisplayed) {
        const feature = getAMPFeature({
          code: Layers.AMP_LINKED_TO_VIGILANCE_AREA.code,
          isolatedLayer,
          layer: AMPlayer
        })
        if (!feature) {
          return feats
        }
        feats.push(feature)
      }

      return feats
    }, [])
  }, [ampLayers, selectedVigilanceArea?.linkedAMPs, ampIdsToBeDisplayed, showedPinnedAMPLayerIds, isolatedLayer])

  const ampVectorSourceRef = useRef(new VectorSource()) as MutableRefObject<VectorSource<Feature<Geometry>>>
  const ampVectorLayerRef = useRef(
    new VectorLayer({
      renderBuffer: 7,
      source: ampVectorSourceRef.current,
      style: getAMPLayerStyle,
      zIndex: Layers.AMP_LINKED_TO_VIGILANCE_AREA.zIndex
    })
  ) as MutableRefObject<VectorLayerWithName>
  ampVectorLayerRef.current.name = Layers.AMP_LINKED_TO_VIGILANCE_AREA.code

  useEffect(() => {
    map.getLayers().push(vectorLayerRef.current)
    map.getLayers().push(regulatoryAreasVectorLayerRef.current)
    map.getLayers().push(ampVectorLayerRef.current)

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      map.removeLayer(vectorLayerRef.current)
      // eslint-disable-next-line react-hooks/exhaustive-deps
      map.removeLayer(regulatoryAreasVectorLayerRef.current)
      // eslint-disable-next-line react-hooks/exhaustive-deps
      map.removeLayer(ampVectorLayerRef.current)
    }
  }, [map])

  useEffect(() => {
    vectorSourceRef.current?.clear(true)
    regulatoryAreasVectorSourceRef.current?.clear(true)
    ampVectorSourceRef.current?.clear(true)
    if (vigilanceAreasFeature) {
      vectorSourceRef.current?.addFeature(vigilanceAreasFeature)
    }
    if (regulatoryAreasFeatures) {
      regulatoryAreasVectorSourceRef.current?.addFeatures(regulatoryAreasFeatures)
    }
    if (ampFeatures) {
      ampVectorSourceRef.current?.addFeatures(ampFeatures)
    }
  }, [vigilanceAreasFeature, regulatoryAreasFeatures, ampFeatures])

  useEffect(() => {
    vectorLayerRef.current?.setVisible(isLayerVisible)
    regulatoryAreasVectorLayerRef.current?.setVisible(isRegulatoryLayerVisible)
    ampVectorLayerRef.current?.setVisible(isAMPLayerVisible)
  }, [isLayerVisible, isRegulatoryLayerVisible, isAMPLayerVisible])

  return null
}
