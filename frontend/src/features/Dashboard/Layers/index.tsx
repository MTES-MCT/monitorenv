import { useGetRegulatoryLayersQuery } from '@api/regulatoryLayersAPI'
import { getRegulatoryFeature } from '@features/map/layers/Regulatory/regulatoryGeometryHelpers'
import { getRegulatoryLayerStyle } from '@features/map/layers/styles/administrativeAndRegulatoryLayers.style'
import { useAppSelector } from '@hooks/useAppSelector'
import { Feature } from 'ol'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { useEffect, useRef } from 'react'

import { Dashboard } from '../types'

import type { BaseMapChildrenProps } from '@features/map/BaseMap'
import type { VectorLayerWithName } from 'domain/types/layer'
import type { Geometry } from 'ol/geom'

export function DashboardLayer({ map }: BaseMapChildrenProps) {
  const displayDashboardLayer = useAppSelector(state => state.global.displayDashboardLayer)

  const activeDashboardId = useAppSelector(state => state.dashboard.activeDashboardId)

  const selectedRegulatoryAreaIds = useAppSelector(state =>
    activeDashboardId ? state.dashboard.dashboards?.[activeDashboardId]?.[Dashboard.Block.REGULATORY_AREAS] : []
  )

  const isLayerVisible = displayDashboardLayer

  const { data: regulatoryLayers } = useGetRegulatoryLayersQuery()

  const vectorSourceRef = useRef(new VectorSource()) as React.MutableRefObject<VectorSource<Feature<Geometry>>>
  const vectorLayerRef = useRef(
    new VectorLayer({
      renderBuffer: 7,
      renderOrder: (a, b) => b.get('area') - a.get('area'),
      source: vectorSourceRef.current,
      style: getRegulatoryLayerStyle,
      updateWhileAnimating: true,
      updateWhileInteracting: true,
      zIndex: 1500 // TODO: create constants
    })
  ) as React.MutableRefObject<VectorLayerWithName>
  ;(vectorLayerRef.current as VectorLayerWithName).name = 'DASHBOARD' // TODO: create constants

  useEffect(() => {
    if (map) {
      vectorSourceRef.current.clear(true)

      if (regulatoryLayers?.entities) {
        const features = (selectedRegulatoryAreaIds ?? []).reduce((feats: Feature[], layerId) => {
          const layer = regulatoryLayers.entities[layerId]
          if (layer && layer?.geom && layer?.geom?.coordinates.length > 0) {
            const feature = getRegulatoryFeature({ code: 'DASHBOARD', layer })

            feats.push(feature)
          }

          return feats
        }, [])

        vectorSourceRef.current.addFeatures(features)
      }
    }
  }, [map, regulatoryLayers, selectedRegulatoryAreaIds])

  useEffect(() => {
    map.getLayers().push(vectorLayerRef.current)

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      map.removeLayer(vectorLayerRef.current)
    }
  }, [map])

  useEffect(() => {
    vectorLayerRef.current?.setVisible(isLayerVisible)
  }, [isLayerVisible])

  return null
}
