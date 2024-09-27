import { useGetRegulatoryLayersQuery } from '@api/regulatoryLayersAPI'
import { useGetVigilanceAreasQuery } from '@api/vigilanceAreasAPI'
import { getRegulatoryFeature } from '@features/map/layers/Regulatory/regulatoryGeometryHelpers'
import { getRegulatoryLayerStyle } from '@features/map/layers/styles/administrativeAndRegulatoryLayers.style'
import { getVigilanceAreaLayerStyle } from '@features/VigilanceArea/components/VigilanceAreaLayer/style'
import { getVigilanceAreaZoneFeature } from '@features/VigilanceArea/components/VigilanceAreaLayer/vigilanceAreaGeometryHelper'
import { useAppSelector } from '@hooks/useAppSelector'
import { Layers } from 'domain/entities/layers/constants'
import { Feature } from 'ol'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { useEffect, useRef } from 'react'

import { Dashboard } from '../../types'

import type { BaseMapChildrenProps } from '@features/map/BaseMap'
import type { VectorLayerWithName } from 'domain/types/layer'
import type { Geometry } from 'ol/geom'

export function DashboardLayer({ map }: BaseMapChildrenProps) {
  const displayDashboardLayer = useAppSelector(state => state.global.displayDashboardLayer)
  const isLayerVisible = displayDashboardLayer

  const activeDashboardId = useAppSelector(state => state.dashboard.activeDashboardId)
  const openPanel = useAppSelector(state =>
    activeDashboardId ? state.dashboard.dashboards?.[activeDashboardId]?.openPanel : undefined
  )

  // Regulatory Areas
  const selectedRegulatoryAreaIds = useAppSelector(state =>
    activeDashboardId ? state.dashboard.dashboards?.[activeDashboardId]?.[Dashboard.Block.REGULATORY_AREAS] : []
  )

  const { data: regulatoryLayers } = useGetRegulatoryLayersQuery()
  const regulatoryLayersVectorSourceRef = useRef(new VectorSource()) as React.MutableRefObject<
    VectorSource<Feature<Geometry>>
  >
  const regulatoryLayersVectorLayerRef = useRef(
    new VectorLayer({
      renderBuffer: 7,
      renderOrder: (a, b) => b.get('area') - a.get('area'),
      source: regulatoryLayersVectorSourceRef.current,
      style: getRegulatoryLayerStyle,
      updateWhileAnimating: true,
      updateWhileInteracting: true,
      zIndex: Layers.DASHBOARD.zIndex
    })
  ) as React.MutableRefObject<VectorLayerWithName>
  ;(regulatoryLayersVectorLayerRef.current as VectorLayerWithName).name = Layers.DASHBOARD.code

  useEffect(() => {
    if (map) {
      regulatoryLayersVectorSourceRef.current.clear(true)

      if (regulatoryLayers?.entities) {
        let regulatoryLayersIds = [...(selectedRegulatoryAreaIds ?? [])]
        const openPanelIsRegulatory = openPanel?.type === Dashboard.Block.REGULATORY_AREAS
        // we don't want to display the area twice
        if (openPanelIsRegulatory) {
          regulatoryLayersIds = [...(selectedRegulatoryAreaIds ?? [])]?.filter(id => id !== openPanel?.id)
        }
        const features = (regulatoryLayersIds ?? []).reduce((feats: Feature[], layerId) => {
          const layer = regulatoryLayers.entities[layerId]

          if (layer && layer?.geom && layer?.geom?.coordinates.length > 0) {
            const feature = getRegulatoryFeature({ code: Layers.REGULATORY_ENV_PREVIEW.code, layer })

            feats.push(feature)
          }

          return feats
        }, [])

        regulatoryLayersVectorSourceRef.current.addFeatures(features)
      }
    }
  }, [map, openPanel?.id, openPanel?.type, regulatoryLayers, selectedRegulatoryAreaIds])

  // Vigilance Areas
  const selectedVigilanceAreaIds = useAppSelector(state =>
    activeDashboardId ? state.dashboard.dashboards?.[activeDashboardId]?.[Dashboard.Block.VIGILANCE_AREAS] : []
  )
  const { data: vigilanceAreas } = useGetVigilanceAreasQuery()

  const vigilanceAreaLayersVectorSourceRef = useRef(new VectorSource()) as React.MutableRefObject<
    VectorSource<Feature<Geometry>>
  >
  const vigilanceAreaLayersVectorLayerRef = useRef(
    new VectorLayer({
      renderBuffer: 7,
      source: vigilanceAreaLayersVectorSourceRef.current,
      style: getVigilanceAreaLayerStyle,
      updateWhileAnimating: true,
      updateWhileInteracting: true,
      zIndex: Layers.DASHBOARD.zIndex
    })
  ) as React.MutableRefObject<VectorLayerWithName>
  ;(vigilanceAreaLayersVectorLayerRef.current as VectorLayerWithName).name = Layers.DASHBOARD.code

  useEffect(() => {
    if (map) {
      vigilanceAreaLayersVectorSourceRef.current.clear(true)

      if (vigilanceAreas?.entities) {
        const features = selectedVigilanceAreaIds?.reduce((feats: Feature[], layerId) => {
          const layer = vigilanceAreas.entities[layerId]
          if (layer && layer?.geom && layer?.geom?.coordinates.length > 0) {
            const feature = getVigilanceAreaZoneFeature(layer, Layers.VIGILANCE_AREA.code)

            feats.push(feature)
          }

          return feats
        }, [])

        vigilanceAreaLayersVectorSourceRef.current.addFeatures(features ?? [])
      }
    }
  }, [map, vigilanceAreas, selectedVigilanceAreaIds])

  useEffect(() => {
    map.getLayers().push(regulatoryLayersVectorLayerRef.current)
    map.getLayers().push(vigilanceAreaLayersVectorLayerRef.current)

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      map.removeLayer(regulatoryLayersVectorLayerRef.current)
      // eslint-disable-next-line react-hooks/exhaustive-deps
      map.removeLayer(vigilanceAreaLayersVectorLayerRef.current)
    }
  }, [map])

  useEffect(() => {
    regulatoryLayersVectorLayerRef.current?.setVisible(isLayerVisible)
    vigilanceAreaLayersVectorLayerRef.current?.setVisible(isLayerVisible)
  }, [isLayerVisible])

  return null
}
