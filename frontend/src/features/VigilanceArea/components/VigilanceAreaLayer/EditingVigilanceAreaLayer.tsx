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
import { getFormattedGeomForFeature, getVigilanceAreaZoneFeature } from './vigilanceAreaGeometryHelper'

import type { BaseMapChildrenProps } from '@features/map/BaseMap'
import type { VectorLayerWithName } from 'domain/types/layer'
import type { Feature } from 'ol'
import type { Geometry } from 'ol/geom'

export function EditingVigilanceAreaLayer({ map }: BaseMapChildrenProps) {
  const editingVigilanceAreaId = useAppSelector(state => state.vigilanceArea.editingVigilanceAreaId)
  const regulatoryAreasToAdd = useAppSelector(state => state.vigilanceArea.regulatoryAreasToAdd)
  const ampToAdd = useAppSelector(state => state.vigilanceArea.ampToAdd)
  const vigilanceAreaGeom = useAppSelector(state => state.vigilanceArea.geometry)

  const isLayerVisible = !!editingVigilanceAreaId

  // Vigilance Area
  const { editingVigilanceArea } = useGetVigilanceAreasQuery(undefined, {
    selectFromResult: ({ data }) => ({
      editingVigilanceArea: data?.find(area => area.id === editingVigilanceAreaId)
    }),
    skip: !editingVigilanceAreaId || editingVigilanceAreaId === -1
  })

  const vigilanceAreasFeature = useMemo(() => {
    if (vigilanceAreaGeom) {
      return getFormattedGeomForFeature(vigilanceAreaGeom, editingVigilanceArea)
    }

    if (editingVigilanceArea) {
      return getVigilanceAreaZoneFeature(editingVigilanceArea, Layers.VIGILANCE_AREA.code, true)
    }

    return undefined
  }, [editingVigilanceArea, vigilanceAreaGeom])

  const vectorSourceRef = useRef(new VectorSource()) as React.MutableRefObject<VectorSource<Feature<Geometry>>>
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

  // Regulatory Areas Layers
  const { data: regulatoryLayers } = useGetRegulatoryLayersQuery()
  const regulatoryAreasFeatures = useMemo(() => {
    if (!regulatoryLayers || regulatoryAreasToAdd.length === 0) {
      return []
    }

    return regulatoryAreasToAdd?.reduce((feats: Feature[], regulatorylayerId) => {
      const regulatorylayer = regulatoryLayers.entities[regulatorylayerId]
      if (regulatorylayer) {
        const feature = getRegulatoryFeature({
          code: Layers.REGULATORY_AREAS_LINKED_TO_VIGILANCE_AREA.code,
          layer: regulatorylayer
        })

        feats.push(feature)
      }

      return feats
    }, [])
  }, [regulatoryLayers, regulatoryAreasToAdd])

  const regulatoryAreasVectorSourceRef = useRef(new VectorSource()) as MutableRefObject<VectorSource<Feature<Geometry>>>
  const regulatoryAreasVectorLayerRef = useRef(
    new VectorLayer({
      renderBuffer: 7,
      source: regulatoryAreasVectorSourceRef.current,
      style: getRegulatoryLayerStyle,
      updateWhileAnimating: true,
      updateWhileInteracting: true,
      zIndex: Layers.REGULATORY_AREAS_LINKED_TO_VIGILANCE_AREA.zIndex
    })
  ) as MutableRefObject<VectorLayerWithName>
  ;(regulatoryAreasVectorLayerRef.current as VectorLayerWithName).name =
    Layers.REGULATORY_AREAS_LINKED_TO_VIGILANCE_AREA.code

  // AMP Layer
  const { data: AMPLayers } = useGetAMPsQuery()
  const AMPFeatures = useMemo(() => {
    if (!AMPLayers || ampToAdd.length === 0) {
      return []
    }

    return ampToAdd.reduce((feats: Feature[], AMPLayerId) => {
      const AMPlayer = AMPLayers.entities[AMPLayerId]

      if (AMPlayer) {
        const feature = getAMPFeature({
          code: Layers.AMP_LINKED_TO_VIGILANCE_AREA.code,
          layer: AMPlayer
        })

        feats.push(feature)
      }

      return feats
    }, [])
  }, [AMPLayers, ampToAdd])

  const AMPVectorSourceRef = useRef(new VectorSource()) as MutableRefObject<VectorSource<Feature<Geometry>>>
  const AMPVectorLayerRef = useRef(
    new VectorLayer({
      renderBuffer: 7,
      source: AMPVectorSourceRef.current,
      style: getAMPLayerStyle,
      updateWhileAnimating: true,
      updateWhileInteracting: true,
      zIndex: Layers.AMP_LINKED_TO_VIGILANCE_AREA.zIndex
    })
  ) as MutableRefObject<VectorLayerWithName>
  ;(AMPVectorLayerRef.current as VectorLayerWithName).name = Layers.AMP_LINKED_TO_VIGILANCE_AREA.code

  useEffect(() => {
    map.getLayers().push(vectorLayerRef.current)
    map.getLayers().push(regulatoryAreasVectorLayerRef.current)
    map.getLayers().push(AMPVectorLayerRef.current)

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      map.removeLayer(vectorLayerRef.current)
      // eslint-disable-next-line react-hooks/exhaustive-deps
      map.removeLayer(regulatoryAreasVectorLayerRef.current)
      // eslint-disable-next-line react-hooks/exhaustive-deps
      map.removeLayer(AMPVectorLayerRef.current)
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
    if (AMPFeatures) {
      AMPVectorSourceRef.current?.addFeatures(AMPFeatures)
    }
  }, [vigilanceAreasFeature, regulatoryAreasFeatures, AMPFeatures])

  useEffect(() => {
    vectorLayerRef.current?.setVisible(isLayerVisible)
    regulatoryAreasVectorLayerRef.current?.setVisible(isLayerVisible)
    AMPVectorLayerRef.current?.setVisible(isLayerVisible)
  }, [isLayerVisible])

  return null
}
