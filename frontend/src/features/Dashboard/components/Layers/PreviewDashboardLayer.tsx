import { useGetAmpsByIdsQuery } from '@api/ampsAPI'
import { useGetRegulatoryAreasByIdsQuery } from '@api/regulatoryLayersAPI'
import { useGetVigilanceAreaQuery } from '@api/vigilanceAreasAPI'
import { getDashboardById } from '@features/Dashboard/slice'
import { Dashboard } from '@features/Dashboard/types'
import { getAMPFeature } from '@features/map/layers/AMP/AMPGeometryHelpers'
import { getRegulatoryFeature } from '@features/map/layers/Regulatory/regulatoryGeometryHelpers'
import { getReportingZoneFeature } from '@features/Reportings/components/ReportingLayer/Reporting/reportingsGeometryHelpers'
import { getVigilanceAreaZoneFeature } from '@features/VigilanceArea/components/VigilanceAreaLayer/vigilanceAreaGeometryHelper'
import { useAppSelector } from '@hooks/useAppSelector'
import { skipToken } from '@reduxjs/toolkit/query'
import { Layers } from 'domain/entities/layers/constants'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import React, { useCallback, useEffect, useMemo, useRef } from 'react'

import { getDashboardStyle } from './style'

import type { BaseMapChildrenProps } from '@features/map/BaseMap'
import type { VectorLayerWithName } from 'domain/types/layer'
import type { Feature } from 'ol'
import type { Geometry } from 'ol/geom'

export function DashboardPreviewLayer({ map }: BaseMapChildrenProps) {
  const displayDashboardLayer = useAppSelector(state => state.global.layers.displayDashboardLayer)

  const isolatedLayer = useAppSelector(state => state.map.isolatedLayer)

  const activeDashboardId = useAppSelector(state => state.dashboard.activeDashboardId)

  const dashboard = useAppSelector(state => getDashboardById(state.dashboard, activeDashboardId))
  const openPanel = dashboard?.openPanel

  const isLayerVisible = displayDashboardLayer && !!dashboard

  const drawBorder = useCallback(
    (layerId: number, feature: Feature<Geometry>, type: Dashboard.Block) => {
      if (layerId === openPanel?.id && openPanel.type === type) {
        feature.set('metadataIsShowed', true)
      }
    },
    [openPanel]
  )
  const regulatoryAreaIdsToDisplay = useMemo(() => {
    let regulatoryAreaToDisplay = dashboard?.regulatoryIdsToDisplay ?? []

    if (openPanel?.type !== Dashboard.Block.REGULATORY_AREAS) {
      return []
    }

    if (openPanel?.type === Dashboard.Block.REGULATORY_AREAS && !regulatoryAreaToDisplay.includes(openPanel.id)) {
      regulatoryAreaToDisplay = [...regulatoryAreaToDisplay, openPanel.id]
    }

    return regulatoryAreaToDisplay
  }, [dashboard?.regulatoryIdsToDisplay, openPanel?.id, openPanel?.type])

  const { data: regulatoryLayers } = useGetRegulatoryAreasByIdsQuery(regulatoryAreaIdsToDisplay, {
    skip: !isLayerVisible
  })

  const ampIdsToDisplay = useMemo(() => {
    let ampToDisplay = dashboard?.ampIdsToDisplay ?? []
    if (openPanel?.type !== Dashboard.Block.AMP) {
      return []
    }
    if (openPanel?.type === Dashboard.Block.AMP && !ampToDisplay.includes(openPanel.id)) {
      ampToDisplay = [...ampToDisplay, openPanel.id]
    }

    return ampToDisplay
  }, [dashboard?.ampIdsToDisplay, openPanel?.id, openPanel?.type])

  const { data: ampLayers } = useGetAmpsByIdsQuery(ampIdsToDisplay, {
    skip: !isLayerVisible
  })
  const openPanelIsVigilanceArea = openPanel?.type === Dashboard.Block.VIGILANCE_AREAS

  const shouldFetchVigilanceArea = openPanel && openPanelIsVigilanceArea && isLayerVisible

  const { data: vigilanceArea } = useGetVigilanceAreaQuery(shouldFetchVigilanceArea ? openPanel.id : skipToken)

  const previewLayersVectorSourceRef = useRef(new VectorSource()) as React.MutableRefObject<
    VectorSource<Feature<Geometry>>
  >
  const previewLayersVectorLayerRef = useRef(
    new VectorLayer({
      renderBuffer: 7,
      renderOrder: (a, b) => b.get('area') - a.get('area'),
      source: previewLayersVectorSourceRef.current,
      style: feature => getDashboardStyle(feature),
      zIndex: Layers.DASHBOARD_PREVIEW.zIndex
    })
  ) as React.MutableRefObject<VectorLayerWithName>
  previewLayersVectorLayerRef.current.name = Layers.DASHBOARD_PREVIEW.code

  useEffect(() => {
    if (map) {
      previewLayersVectorSourceRef.current.clear(true)

      if (dashboard) {
        // Regulatory Areas
        if (regulatoryLayers) {
          const features = regulatoryLayers.reduce((feats: Feature[], layer) => {
            if (layer && layer?.geom && layer?.geom?.coordinates.length > 0) {
              const feature = getRegulatoryFeature({
                code: Dashboard.featuresCode.DASHBOARD_REGULATORY_AREAS,
                isolatedLayer,
                layer
              })
              if (!feature) {
                return feats
              }

              drawBorder(layer.id, feature, Dashboard.Block.REGULATORY_AREAS)
              feats.push(feature)
            }

            return feats
          }, [])

          previewLayersVectorSourceRef.current.addFeatures(features)
        }

        // AMP
        if (ampLayers) {
          const features = ampLayers.reduce((feats: Feature[], layer) => {
            if (layer?.geom && layer?.geom?.coordinates.length > 0) {
              const feature = getAMPFeature({ code: Dashboard.featuresCode.DASHBOARD_AMP, isolatedLayer, layer })
              if (!feature) {
                return feats
              }
              drawBorder(layer.id, feature, Dashboard.Block.AMP)
              feats.push(feature)
            }

            return feats
          }, [])

          previewLayersVectorSourceRef.current.addFeatures(features ?? [])
        }

        // Vigilance Areas
        if (vigilanceArea) {
          if (vigilanceArea && vigilanceArea?.geom && vigilanceArea?.geom?.coordinates.length > 0) {
            const feature = getVigilanceAreaZoneFeature(
              vigilanceArea,
              Dashboard.featuresCode.DASHBOARD_VIGILANCE_AREAS,
              isolatedLayer
            )
            feature.set('isSelected', true)

            previewLayersVectorSourceRef.current.addFeature(feature)
          }
        }

        // Reporting
        if (dashboard.reportingToDisplay?.geom) {
          const feature = getReportingZoneFeature(
            dashboard.reportingToDisplay,
            Dashboard.featuresCode.DASHBOARD_REPORTINGS
          )
          previewLayersVectorSourceRef.current.addFeature(feature)
        }
      }
    }
  }, [ampLayers, dashboard, drawBorder, isolatedLayer, map, openPanelIsVigilanceArea, regulatoryLayers, vigilanceArea])

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
