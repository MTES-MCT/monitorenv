import { useGetAmpsByIdsQuery } from '@api/ampsAPI'
import { useGetRegulatoryAreasByIdsQuery } from '@api/regulatoryLayersAPI'
import { useGetReportingsByIdsQuery } from '@api/reportingsAPI'
import { useGetVigilanceAreasByIdsQuery } from '@api/vigilanceAreasAPI'
import { getDashboardById } from '@features/Dashboard/slice'
import { getAMPFeature } from '@features/map/layers/AMP/AMPGeometryHelpers'
import { getRegulatoryFeature } from '@features/map/layers/Regulatory/regulatoryGeometryHelpers'
import { measurementStyle, measurementStyleWithCenter } from '@features/map/layers/styles/measurement.style'
import { getReportingZoneFeature } from '@features/Reportings/components/ReportingLayer/Reporting/reportingsGeometryHelpers'
import { getVigilanceAreaZoneFeature } from '@features/VigilanceArea/components/VigilanceAreaLayer/vigilanceAreaGeometryHelper'
import { useAppSelector } from '@hooks/useAppSelector'
import { skipToken } from '@reduxjs/toolkit/query'
import { getFeature } from '@utils/getFeature'
import { Layers } from 'domain/entities/layers/constants'
import { Feature } from 'ol'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import React, { useCallback, useEffect, useRef } from 'react'

import { dashboardIcon, getDashboardStyle } from './style'
import { Dashboard } from '../../types'

import type { BaseMapChildrenProps } from '@features/map/BaseMap'
import type { VectorLayerWithName } from 'domain/types/layer'
import type { Geometry } from 'ol/geom'

export function ActiveDashboardLayer({ map }: BaseMapChildrenProps) {
  const isolatedLayer = useAppSelector(state => state.map.isolatedLayer)

  const activeDashboardId = useAppSelector(state => state.dashboard.activeDashboardId)
  const displayGeometry = useAppSelector(state =>
    activeDashboardId ? state.dashboard.dashboards?.[activeDashboardId]?.displayGeometry : false
  )
  const mapFocus = useAppSelector(state => state.dashboard.mapFocus)

  const dashboard = useAppSelector(state => getDashboardById(state.dashboard, activeDashboardId))

  const openPanel = dashboard?.openPanel
  const activeDashboard = dashboard?.dashboard

  const isLayerVisible = !!dashboard
  const { data: reportings } = useGetReportingsByIdsQuery(
    activeDashboard && activeDashboard.reportingIds.length > 0 ? activeDashboard.reportingIds : skipToken,
    {
      skip: !isLayerVisible
    }
  )
  const { data: regulatoryLayers } = useGetRegulatoryAreasByIdsQuery(
    activeDashboard && activeDashboard.regulatoryAreaIds.length > 0 ? activeDashboard.regulatoryAreaIds : skipToken,
    {
      skip: !isLayerVisible
    }
  )
  const { data: ampLayers } = useGetAmpsByIdsQuery(
    activeDashboard && activeDashboard.ampIds.length > 0 ? activeDashboard.ampIds : skipToken,
    { skip: !dashboard }
  )
  const { data: vigilanceAreas } = useGetVigilanceAreasByIdsQuery(
    activeDashboard && activeDashboard.vigilanceAreaIds.length > 0 ? activeDashboard.vigilanceAreaIds : skipToken,
    {
      skip: !isLayerVisible
    }
  )

  const metadataLayerId = useAppSelector(state => state.layersMetadata.metadataLayerId)
  const drawBorder = useCallback(
    (layerId: number, feature: Feature<Geometry>, type: Dashboard.Block) => {
      if ((layerId === openPanel?.id && openPanel.type === type) || metadataLayerId === layerId) {
        feature.set('metadataIsShowed', true)
      }
    },
    [openPanel, metadataLayerId]
  )

  const layersVectorSourceRef = useRef(new VectorSource()) as React.MutableRefObject<VectorSource<Feature<Geometry>>>
  const layersVectorLayerRef = useRef(
    new VectorLayer({
      renderBuffer: 7,
      renderOrder: (a, b) => b.get('area') - a.get('area'),
      source: layersVectorSourceRef.current,
      style: feature => getDashboardStyle(feature),
      zIndex: Layers.DASHBOARD.zIndex
    })
  ) as React.MutableRefObject<VectorLayerWithName>
  layersVectorLayerRef.current.name = Layers.DASHBOARD.code

  useEffect(() => {
    if (map) {
      layersVectorSourceRef.current.clear(true)

      if (activeDashboard && !mapFocus) {
        // Regulatory Areas
        if (regulatoryLayers) {
          const features = regulatoryLayers.reduce((feats: Feature[], layer) => {
            if (layer.geom && layer.geom?.coordinates.length > 0) {
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
          layersVectorSourceRef.current.addFeatures(features)
        }

        // AMP
        if (ampLayers) {
          const features = ampLayers?.reduce((feats: Feature[], layer) => {
            if (layer.geom && layer.geom?.coordinates.length > 0) {
              const feature = getAMPFeature({ code: Dashboard.featuresCode.DASHBOARD_AMP, isolatedLayer, layer })

              if (!feature) {
                return feats
              }
              drawBorder(layer.id, feature, Dashboard.Block.AMP)

              feats.push(feature)
            }

            return feats
          }, [])

          layersVectorSourceRef.current.addFeatures(features)
        }

        // Vigilance Areas
        if (vigilanceAreas) {
          const features = vigilanceAreas.reduce((feats: Feature[], layer) => {
            if (layer.geom && layer.geom?.coordinates.length > 0) {
              const feature = getVigilanceAreaZoneFeature(
                layer,
                Dashboard.featuresCode.DASHBOARD_VIGILANCE_AREAS,
                isolatedLayer
              )
              feats.push(feature)
            }

            return feats
          }, [])

          layersVectorSourceRef.current.addFeatures(features)
        }

        // Reportings
        if (reportings) {
          const features = Object.values(reportings?.entities ?? []).reduce((feats: Feature[], reporting) => {
            if (reporting.geom) {
              const feature = getReportingZoneFeature(reporting, Dashboard.featuresCode.DASHBOARD_REPORTINGS)
              feats.push(feature)
            }

            return feats
          }, [])

          layersVectorSourceRef.current.addFeatures(features)
        }
      }

      if (dashboard?.dashboard.geom && displayGeometry) {
        const dashboardAreaFeature = getFeature(dashboard.dashboard.geom)
        if (!dashboardAreaFeature) {
          return
        }
        dashboardAreaFeature.setId(`${Layers.DASHBOARDS.code}:${activeDashboardId}`)
        dashboardAreaFeature?.setStyle([measurementStyle(), measurementStyleWithCenter, dashboardIcon()])

        layersVectorSourceRef.current.addFeature(dashboardAreaFeature)
      }
    }
  }, [
    activeDashboard,
    activeDashboardId,
    ampLayers,
    dashboard?.dashboard.geom,
    displayGeometry,
    drawBorder,
    isolatedLayer,
    map,
    mapFocus,
    regulatoryLayers,
    reportings,
    vigilanceAreas
  ])

  useEffect(() => {
    map.getLayers().push(layersVectorLayerRef.current)

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      map.removeLayer(layersVectorLayerRef.current)
    }
  }, [map])

  useEffect(() => {
    layersVectorLayerRef.current?.setVisible(isLayerVisible)
  }, [isLayerVisible])

  return null
}
