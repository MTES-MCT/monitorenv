import { getDashboardById } from '@features/Dashboard/slice'
import { getAMPFeature } from '@features/map/layers/AMP/AMPGeometryHelpers'
import { getRegulatoryFeature } from '@features/map/layers/Regulatory/regulatoryGeometryHelpers'
import { measurementStyle, measurementStyleWithCenter } from '@features/map/layers/styles/measurement.style'
import { getReportingZoneFeature } from '@features/Reportings/components/ReportingLayer/Reporting/reportingsGeometryHelpers'
import { getVigilanceAreaZoneFeature } from '@features/VigilanceArea/components/VigilanceAreaLayer/vigilanceAreaGeometryHelper'
import { useAppSelector } from '@hooks/useAppSelector'
import { getFeature } from '@utils/getFeature'
import { Layers } from 'domain/entities/layers/constants'
import { Feature } from 'ol'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import React, { useCallback, useEffect, useMemo, useRef } from 'react'

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

  const reportings = useMemo(
    () => dashboard?.extractedArea?.reportings.filter(({ id }) => activeDashboard?.reportingIds.includes(+id)) ?? [],
    [activeDashboard?.reportingIds, dashboard?.extractedArea?.reportings]
  )

  const regulatoryAreas = useMemo(
    () =>
      dashboard?.extractedArea?.regulatoryAreas.filter(({ id }) => activeDashboard?.regulatoryAreaIds.includes(id)) ??
      [],
    [activeDashboard?.regulatoryAreaIds, dashboard?.extractedArea?.regulatoryAreas]
  )

  const amps = useMemo(
    () => dashboard?.extractedArea?.amps.filter(({ id }) => activeDashboard?.ampIds.includes(id)) ?? [],
    [activeDashboard?.ampIds, dashboard?.extractedArea?.amps]
  )

  const vigilanceAreas = useMemo(
    () =>
      dashboard?.extractedArea?.vigilanceAreas.filter(({ id }) => activeDashboard?.vigilanceAreaIds.includes(id)) ?? [],
    [activeDashboard?.vigilanceAreaIds, dashboard?.extractedArea?.vigilanceAreas]
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
        const regulatoryAreaFeatures = regulatoryAreas.reduce<Feature<Geometry>[]>((acc, regulatoryArea) => {
          const feature = getRegulatoryFeature({
            code: Dashboard.featuresCode.DASHBOARD_REGULATORY_AREAS,
            isolatedLayer,
            layer: regulatoryArea
          })

          if (feature) {
            drawBorder(regulatoryArea.id, feature, Dashboard.Block.REGULATORY_AREAS)
            acc.push(feature)
          }

          return acc
        }, [])

        layersVectorSourceRef.current.addFeatures(regulatoryAreaFeatures)
        // AMP
        const ampFeatures = amps?.reduce((feats: Feature[], layer) => {
          if (layer && layer?.geom && layer?.geom?.coordinates.length > 0) {
            const feature = getAMPFeature({ code: Dashboard.featuresCode.DASHBOARD_AMP, isolatedLayer, layer })

            if (!feature) {
              return feats
            }
            drawBorder(layer.id, feature, Dashboard.Block.AMP)

            feats.push(feature)
          }

          return feats
        }, [])

        layersVectorSourceRef.current.addFeatures(ampFeatures)

        // Vigilance Areas
        const vigilanceAreaFeatures = vigilanceAreas.reduce((feats: Feature[], layer) => {
          if (layer?.geom && layer?.geom?.coordinates.length > 0) {
            const feature = getVigilanceAreaZoneFeature(
              layer,
              Dashboard.featuresCode.DASHBOARD_VIGILANCE_AREAS,
              isolatedLayer
            )
            feats.push(feature)
          }

          return feats
        }, [])

        layersVectorSourceRef.current.addFeatures(vigilanceAreaFeatures)

        // Reportings
        const reportingFeatures = reportings.reduce((feats: Feature[], reporting) => {
          if (reporting.geom) {
            const feature = getReportingZoneFeature(reporting, Dashboard.featuresCode.DASHBOARD_REPORTINGS)
            feats.push(feature)
          }

          return feats
        }, [])

        layersVectorSourceRef.current.addFeatures(reportingFeatures)
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
    amps,
    map,
    vigilanceAreas,
    mapFocus,
    reportings,
    dashboard?.dashboard?.geom,
    drawBorder,
    displayGeometry,
    isolatedLayer,
    regulatoryAreas
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
