import { useGetAMPsQuery } from '@api/ampsAPI'
import { useGetRegulatoryLayersQuery } from '@api/regulatoryLayersAPI'
import { useGetReportingsByIdsQuery } from '@api/reportingsAPI'
import { useGetVigilanceAreasQuery } from '@api/vigilanceAreasAPI'
import { getDashboardById } from '@features/Dashboard/slice'
import { getAMPFeature } from '@features/map/layers/AMP/AMPGeometryHelpers'
import { getAMPLayerStyle } from '@features/map/layers/AMP/AMPLayers.style'
import { getRegulatoryFeature } from '@features/map/layers/Regulatory/regulatoryGeometryHelpers'
import { getRegulatoryLayerStyle } from '@features/map/layers/styles/administrativeAndRegulatoryLayers.style'
import { measurementStyle, measurementStyleWithCenter } from '@features/map/layers/styles/measurement.style'
import { getReportingZoneFeature } from '@features/Reportings/components/ReportingLayer/Reporting/reportingsGeometryHelpers'
import { editingReportingStyleFn } from '@features/Reportings/components/ReportingLayer/Reporting/style'
import { getVigilanceAreaLayerStyle } from '@features/VigilanceArea/components/VigilanceAreaLayer/style'
import { getVigilanceAreaZoneFeature } from '@features/VigilanceArea/components/VigilanceAreaLayer/vigilanceAreaGeometryHelper'
import { useAppSelector } from '@hooks/useAppSelector'
import { OPENLAYERS_PROJECTION } from '@mtes-mct/monitor-ui'
import { Layers } from 'domain/entities/layers/constants'
import { Feature } from 'ol'
import { GeoJSON } from 'ol/format'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { useEffect, useRef } from 'react'

import { Dashboard } from '../../types'

import type { BaseMapChildrenProps } from '@features/map/BaseMap'
import type { VectorLayerWithName } from 'domain/types/layer'
import type { Geometry } from 'ol/geom'

export function ActiveDashboardLayer({ map }: BaseMapChildrenProps) {
  const displayDashboardLayer = useAppSelector(state => state.global.displayDashboardLayer)

  const activeDashboardId = useAppSelector(state => state.dashboard.activeDashboardId)

  const dashboard = useAppSelector(state => getDashboardById(state.dashboard, activeDashboardId))
  const { data: reportings } = useGetReportingsByIdsQuery(dashboard?.dashboard.reportingIds ?? [])
  const { data: regulatoryLayers } = useGetRegulatoryLayersQuery()
  const { data: ampLayers } = useGetAMPsQuery()
  const { data: vigilanceAreas } = useGetVigilanceAreasQuery()

  const openPanel = dashboard?.openPanel
  const activeDashboard = dashboard?.dashboard

  const isLayerVisible = displayDashboardLayer && !!dashboard

  const layersVectorSourceRef = useRef(new VectorSource()) as React.MutableRefObject<VectorSource<Feature<Geometry>>>
  const layersVectorLayerRef = useRef(
    new VectorLayer({
      renderBuffer: 7,
      renderOrder: (a, b) => b.get('area') - a.get('area'),
      source: layersVectorSourceRef.current,
      zIndex: Layers.DASHBOARD.zIndex
    })
  ) as React.MutableRefObject<VectorLayerWithName>
  ;(layersVectorLayerRef.current as VectorLayerWithName).name = Layers.DASHBOARD.code

  useEffect(() => {
    if (map) {
      layersVectorSourceRef.current.clear(true)

      if (activeDashboard) {
        // Regulatory Areas
        if (regulatoryLayers?.entities) {
          let regulatoryLayersIds = activeDashboard.regulatoryAreaIds
          const openPanelIsRegulatory = openPanel?.type === Dashboard.Block.REGULATORY_AREAS
          // we don't want to display the area twice
          if (openPanelIsRegulatory) {
            regulatoryLayersIds = regulatoryLayersIds.filter(id => id !== openPanel?.id)
          }
          const features = regulatoryLayersIds.reduce((feats: Feature[], layerId) => {
            const layer = regulatoryLayers.entities[layerId]

            if (layer && layer?.geom && layer?.geom?.coordinates.length > 0) {
              const feature = getRegulatoryFeature({ code: Dashboard.featuresCode.DASHBOARD_REGULATORY_AREAS, layer })
              feature.setStyle(getRegulatoryLayerStyle(feature))
              feats.push(feature)
            }

            return feats
          }, [])

          layersVectorSourceRef.current.addFeatures(features)
        }

        // AMP
        if (ampLayers?.entities) {
          let ampLayerIds = activeDashboard.ampIds
          const openPanelIsRegulatory = openPanel?.type === Dashboard.Block.AMP
          // we don't want to display the area twice
          if (openPanelIsRegulatory) {
            ampLayerIds = ampLayerIds.filter(id => id !== openPanel?.id)
          }

          const features = ampLayerIds?.reduce((feats: Feature[], layerId) => {
            const layer = ampLayers.entities[layerId]

            if (layer && layer?.geom && layer?.geom?.coordinates.length > 0) {
              const feature = getAMPFeature({ code: Dashboard.featuresCode.DASHBOARD_AMP, layer })
              feature.setStyle(getAMPLayerStyle(feature))

              feats.push(feature)
            }

            return feats
          }, [])

          layersVectorSourceRef.current.addFeatures(features)
        }

        // Vigilance Areas
        if (vigilanceAreas?.entities) {
          let vigilanceAreaLayersIds = activeDashboard.vigilanceAreaIds
          const openPanelIsVigilanceArea = openPanel?.type === Dashboard.Block.VIGILANCE_AREAS
          // we don't want to display the area twice
          if (openPanelIsVigilanceArea) {
            vigilanceAreaLayersIds = vigilanceAreaLayersIds.filter(id => id !== openPanel?.id)
          }
          const features = vigilanceAreaLayersIds.reduce((feats: Feature[], layerId) => {
            const layer = vigilanceAreas.entities[layerId]
            if (layer && layer?.geom && layer?.geom?.coordinates.length > 0) {
              const feature = getVigilanceAreaZoneFeature(layer, Dashboard.featuresCode.DASHBOARD_VIGILANCE_AREAS)
              feature.setStyle(getVigilanceAreaLayerStyle(feature))
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
              feature.setStyle(editingReportingStyleFn)
              feats.push(feature)
            }

            return feats
          }, [])

          layersVectorSourceRef.current.addFeatures(features)
        }
      }

      if (dashboard?.dashboard.geom) {
        const dashboardAreaFeature = new GeoJSON({
          featureProjection: OPENLAYERS_PROJECTION
        }).readFeature(dashboard?.dashboard.geom)
        dashboardAreaFeature.setStyle([measurementStyle, measurementStyleWithCenter])

        layersVectorSourceRef.current.addFeature(dashboardAreaFeature)
      }
    }
  }, [
    activeDashboard,
    ampLayers?.entities,
    activeDashboard?.ampIds,
    activeDashboard?.regulatoryAreaIds,
    activeDashboard?.reportingIds,
    activeDashboard?.vigilanceAreaIds,
    map,
    openPanel?.id,
    openPanel?.type,
    regulatoryLayers,
    vigilanceAreas?.entities,
    reportings,
    dashboard?.dashboard.geom
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
