import { useGetAMPsQuery } from '@api/ampsAPI'
import { useGetRegulatoryLayersQuery } from '@api/regulatoryLayersAPI'
import { useGetVigilanceAreasQuery } from '@api/vigilanceAreasAPI'
import { getDashboardById, type DashboardType } from '@features/Dashboard/slice'
import { Dashboard } from '@features/Dashboard/types'
import { getAMPFeature } from '@features/map/layers/AMP/AMPGeometryHelpers'
import { getAMPLayerStyle } from '@features/map/layers/AMP/AMPLayers.style'
import { getRegulatoryFeature } from '@features/map/layers/Regulatory/regulatoryGeometryHelpers'
import { getRegulatoryLayerStyle } from '@features/map/layers/styles/administrativeAndRegulatoryLayers.style'
import { getReportingZoneFeature } from '@features/Reportings/components/ReportingLayer/Reporting/reportingsGeometryHelpers'
import { editingReportingStyleFn } from '@features/Reportings/components/ReportingLayer/Reporting/style'
import { getVigilanceAreaLayerStyle } from '@features/VigilanceArea/components/VigilanceAreaLayer/style'
import { getVigilanceAreaZoneFeature } from '@features/VigilanceArea/components/VigilanceAreaLayer/vigilanceAreaGeometryHelper'
import { useAppSelector } from '@hooks/useAppSelector'
import { Layers } from 'domain/entities/layers/constants'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { useCallback, useEffect, useRef } from 'react'

import type { BaseMapChildrenProps } from '@features/map/BaseMap'
import type { VectorLayerWithName } from 'domain/types/layer'
import type { Feature } from 'ol'
import type { Geometry } from 'ol/geom'

export function DashboardPreviewLayer({ map }: BaseMapChildrenProps) {
  const displayDashboardLayer = useAppSelector(state => state.global.displayDashboardLayer)

  const activeDashboardId = useAppSelector(state => state.dashboard.activeDashboardId)

  const dashboard: DashboardType = useAppSelector(state => getDashboardById(state, activeDashboardId))

  const isLayerVisible = displayDashboardLayer && !!dashboard

  const openPanel = useAppSelector(state =>
    activeDashboardId ? state.dashboard.dashboards?.[activeDashboardId]?.openPanel : undefined
  )

  const drawBorder = useCallback(
    (layerId: number, feature: Feature<Geometry>, type: Dashboard.Block) => {
      if (layerId === openPanel?.id && openPanel.type === type) {
        feature.set('metadataIsShowed', true)
      }
    },
    [openPanel]
  )
  const { data: regulatoryLayers } = useGetRegulatoryLayersQuery()
  const { data: ampLayers } = useGetAMPsQuery()
  const { data: vigilanceAreas } = useGetVigilanceAreasQuery()

  const previewLayersVectorSourceRef = useRef(new VectorSource()) as React.MutableRefObject<
    VectorSource<Feature<Geometry>>
  >
  const previewLayersVectorLayerRef = useRef(
    new VectorLayer({
      renderBuffer: 7,
      renderOrder: (a, b) => b.get('area') - a.get('area'),
      source: previewLayersVectorSourceRef.current,
      updateWhileAnimating: true,
      updateWhileInteracting: true,
      zIndex: Layers.DASHBOARD_PREVIEW.zIndex
    })
  ) as React.MutableRefObject<VectorLayerWithName>
  ;(previewLayersVectorLayerRef.current as VectorLayerWithName).name = Layers.DASHBOARD_PREVIEW.code

  useEffect(() => {
    if (map) {
      previewLayersVectorSourceRef.current.clear(true)

      // Regulatory Areas
      if (regulatoryLayers?.entities && dashboard) {
        let regulatoryAreaToDisplay = dashboard.regulatoryIdsToDisplay

        if (openPanel?.type === Dashboard.Block.REGULATORY_AREAS && !regulatoryAreaToDisplay.includes(openPanel.id)) {
          regulatoryAreaToDisplay = [...regulatoryAreaToDisplay, openPanel.id]
        }
        const features = regulatoryAreaToDisplay.reduce((feats: Feature[], layerId) => {
          const layer = regulatoryLayers.entities[layerId]
          if (layer && layer?.geom && layer?.geom?.coordinates.length > 0) {
            const feature = getRegulatoryFeature({ code: Dashboard.featuresCode.DASHBOARD_REGULATORY_AREAS, layer })
            drawBorder(layerId, feature, Dashboard.Block.REGULATORY_AREAS)
            feature.setStyle(getRegulatoryLayerStyle(feature))
            feats.push(feature)
          }

          return feats
        }, [])

        previewLayersVectorSourceRef.current.addFeatures(features)
      }

      // AMP
      if (ampLayers?.entities && dashboard) {
        let ampToDisplay = dashboard.ampIdsToDisplay

        if (openPanel?.type === Dashboard.Block.AMP && !ampToDisplay?.includes(openPanel.id)) {
          ampToDisplay = [...(ampToDisplay ?? []), openPanel.id]
        }
        const features = ampToDisplay?.reduce((feats: Feature[], layerId) => {
          const layer = ampLayers.entities[layerId]
          if (layer && layer?.geom && layer?.geom?.coordinates.length > 0) {
            const feature = getAMPFeature({ code: Dashboard.featuresCode.DASHBOARD_AMP, layer })
            drawBorder(layerId, feature, Dashboard.Block.AMP)
            feature.setStyle(getAMPLayerStyle(feature))
            feats.push(feature)
          }

          return feats
        }, [])

        previewLayersVectorSourceRef.current.addFeatures(features ?? [])
      }

      // Vigilance Areas
      const openPanelIsVigilanceArea = openPanel?.type === Dashboard.Block.VIGILANCE_AREAS
      if (vigilanceAreas?.entities && openPanelIsVigilanceArea) {
        const layer = vigilanceAreas.entities[openPanel?.id]
        if (layer && layer?.geom && layer?.geom?.coordinates.length > 0) {
          const feature = getVigilanceAreaZoneFeature(layer, Dashboard.featuresCode.DASHBOARD_VIGILANCE_AREAS)
          feature.set('isSelected', true)
          feature.setStyle(getVigilanceAreaLayerStyle(feature))

          previewLayersVectorSourceRef.current.addFeature(feature)
        }
      }

      // Reporting
      if (dashboard?.reportingToDisplay?.geom && dashboard) {
        const feature = getReportingZoneFeature(
          dashboard.reportingToDisplay,
          Dashboard.featuresCode.DASHBOARD_REPORTINGS
        )
        feature.setStyle(editingReportingStyleFn)
        previewLayersVectorSourceRef.current.addFeature(feature)
      }
    }
  }, [ampLayers?.entities, dashboard, drawBorder, map, openPanel, regulatoryLayers?.entities, vigilanceAreas?.entities])

  useEffect(() => {
    map.getLayers().push(previewLayersVectorLayerRef.current)

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      map.removeLayer(previewLayersVectorLayerRef.current)
    }
  }, [map])

  useEffect(() => {
    previewLayersVectorLayerRef.current?.setVisible(isLayerVisible)
  }, [isLayerVisible])

  return null
}
