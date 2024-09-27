import { useGetRegulatoryLayersQuery } from '@api/regulatoryLayersAPI'
import { useGetVigilanceAreasQuery } from '@api/vigilanceAreasAPI'
import { Dashboard } from '@features/Dashboard/types'
import { getRegulatoryFeature } from '@features/map/layers/Regulatory/regulatoryGeometryHelpers'
import { getRegulatoryLayerStyle } from '@features/map/layers/styles/administrativeAndRegulatoryLayers.style'
import { getVigilanceAreaLayerStyle } from '@features/VigilanceArea/components/VigilanceAreaLayer/style'
import { getVigilanceAreaZoneFeature } from '@features/VigilanceArea/components/VigilanceAreaLayer/vigilanceAreaGeometryHelper'
import { useAppSelector } from '@hooks/useAppSelector'
import { Layers } from 'domain/entities/layers/constants'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { useEffect, useRef } from 'react'

import type { BaseMapChildrenProps } from '@features/map/BaseMap'
import type { VectorLayerWithName } from 'domain/types/layer'
import type { Feature } from 'ol'
import type { Geometry } from 'ol/geom'

export function DashboardPreviewLayer({ map }: BaseMapChildrenProps) {
  const displayDashboardLayer = useAppSelector(state => state.global.displayDashboardLayer)
  const isLayerVisible = displayDashboardLayer

  const activeDashboardId = useAppSelector(state => state.dashboard.activeDashboardId)

  const openPanel = useAppSelector(state =>
    activeDashboardId ? state.dashboard.dashboards?.[activeDashboardId]?.openPanel : undefined
  )

  // Regulatory Areas
  const regulatoryIdsToBeDisplayed = useAppSelector(state =>
    activeDashboardId ? state.dashboard.dashboards?.[activeDashboardId]?.regulatoryIdsToBeDisplayed : []
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
      zIndex: Layers.DASHBOARD_PREVIEW.zIndex
    })
  ) as React.MutableRefObject<VectorLayerWithName>
  ;(regulatoryLayersVectorLayerRef.current as VectorLayerWithName).name = Layers.DASHBOARD_PREVIEW.code

  useEffect(() => {
    if (map) {
      regulatoryLayersVectorSourceRef.current.clear(true)

      if (regulatoryLayers?.entities) {
        // if Regulatory Area Panel is open we want to display area
        if (
          openPanel?.type === Dashboard.Block.REGULATORY_AREAS &&
          !regulatoryIdsToBeDisplayed?.includes(openPanel?.id)
        ) {
          const layer = regulatoryLayers.entities[openPanel?.id]
          if (layer && layer?.geom && layer?.geom?.coordinates.length > 0) {
            const feature = getRegulatoryFeature({ code: Layers.REGULATORY_ENV.code, layer })
            feature.set('metadataIsShowed', true)

            regulatoryLayersVectorSourceRef.current.addFeature(feature)

            return
          }
        }

        // if Vigilance Area Panel is open and user selected a regulatory area we want to display it
        if (regulatoryIdsToBeDisplayed && regulatoryIdsToBeDisplayed.length > 0) {
          const features = regulatoryIdsToBeDisplayed.reduce((feats: Feature[], layerId) => {
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
    }
  }, [map, regulatoryLayers, regulatoryIdsToBeDisplayed, openPanel])

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
      const openPanelIsVigilanceArea = openPanel?.type === Dashboard.Block.VIGILANCE_AREAS

      if (vigilanceAreas?.entities && openPanelIsVigilanceArea) {
        const layer = vigilanceAreas.entities[openPanel?.id]
        if (layer && layer?.geom && layer?.geom?.coordinates.length > 0) {
          const feature = getVigilanceAreaZoneFeature(layer, Layers.VIGILANCE_AREA.code)

          vigilanceAreaLayersVectorSourceRef.current.addFeature(feature)
        }
      }
    }
  }, [map, vigilanceAreas, selectedVigilanceAreaIds, openPanel])

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
