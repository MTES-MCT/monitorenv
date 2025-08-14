import { useGetAMPsQuery } from '@api/ampsAPI'
import { useGetRegulatoryLayersQuery } from '@api/regulatoryLayersAPI'
import { useGetVigilanceAreasQuery } from '@api/vigilanceAreasAPI'
import { getAMPFeature } from '@features/map/layers/AMP/AMPGeometryHelpers'
import { getAMPLayerStyle } from '@features/map/layers/AMP/AMPLayers.style'
import { getRegulatoryFeature } from '@features/map/layers/Regulatory/regulatoryGeometryHelpers'
import { getRegulatoryLayerStyle } from '@features/map/layers/styles/administrativeAndRegulatoryLayers.style'
import { NEW_VIGILANCE_AREA_ID } from '@features/VigilanceArea/constants'
import { useAppSelector } from '@hooks/useAppSelector'
import { useMapContext } from 'context/map/MapContext'
import { Layers } from 'domain/entities/layers/constants'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { memo, useEffect, useMemo, useRef, type MutableRefObject } from 'react'

import { getVigilanceAreaLayerStyle } from './style'
import { getFormattedGeomForFeature, getVigilanceAreaZoneFeature } from './vigilanceAreaGeometryHelper'

import type { VectorLayerWithName } from 'domain/types/layer'
import type { Feature } from 'ol'
import type { Geometry } from 'ol/geom'

export const EditingVigilanceAreaLayer = memo(() => {
  const { map } = useMapContext()

  const editingVigilanceAreaId = useAppSelector(state => state.vigilanceArea.editingVigilanceAreaId)
  const regulatoryAreasToAdd = useAppSelector(state => state.vigilanceArea.regulatoryAreasToAdd)
  const ampToAdd = useAppSelector(state => state.vigilanceArea.ampToAdd)
  const vigilanceAreaGeom = useAppSelector(state => state.vigilanceArea.geometry)

  const isolatedLayer = useAppSelector(state => state.map.isolatedLayer)

  const isLayerVisible = !!editingVigilanceAreaId

  // Vigilance Area
  const { editingVigilanceArea } = useGetVigilanceAreasQuery(undefined, {
    selectFromResult: ({ data }) => ({
      editingVigilanceArea: editingVigilanceAreaId ? data?.entities[editingVigilanceAreaId] : undefined
    }),
    skip: !editingVigilanceAreaId || editingVigilanceAreaId === NEW_VIGILANCE_AREA_ID
  })

  const vigilanceAreasFeature = useMemo(() => {
    if (vigilanceAreaGeom) {
      return getFormattedGeomForFeature(vigilanceAreaGeom, editingVigilanceArea)
    }

    if (editingVigilanceArea) {
      return getVigilanceAreaZoneFeature(editingVigilanceArea, Layers.VIGILANCE_AREA.code, isolatedLayer, true)
    }

    return undefined
  }, [editingVigilanceArea, vigilanceAreaGeom, isolatedLayer])

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
  }, [regulatoryLayers, regulatoryAreasToAdd, isolatedLayer])

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
  const { data: ampLayers } = useGetAMPsQuery()
  const ampFeatures = useMemo(() => {
    if (!ampLayers || ampToAdd.length === 0) {
      return []
    }

    return ampToAdd.reduce(
      (feats: Feature[], AMPLayerId) => {
        const ampLayer = ampLayers.entities[AMPLayerId]

        if (ampLayer) {
          const feature = getAMPFeature({
            code: Layers.AMP_LINKED_TO_VIGILANCE_AREA.code,
            isolatedLayer,
            layer: ampLayer
          })
          if (!feature) {
            return feats
          }

          feats.push(feature)
        }

        return feats
      },

      []
    )
  }, [ampLayers, ampToAdd, isolatedLayer])

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
    regulatoryAreasVectorLayerRef.current?.setVisible(isLayerVisible)
    ampVectorLayerRef.current?.setVisible(isLayerVisible)
  }, [isLayerVisible])

  return null
})
