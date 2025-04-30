import { Dashboard } from '@features/Dashboard/types'
import { getAMPFeature } from '@features/map/layers/AMP/AMPGeometryHelpers'
import { getRegulatoryFeature } from '@features/map/layers/Regulatory/regulatoryGeometryHelpers'
import { measurementStyle, measurementStyleWithCenter } from '@features/map/layers/styles/measurement.style'
import { overlayStroke } from '@features/map/overlays/style'
import { getReportingZoneFeature } from '@features/Reportings/components/ReportingLayer/Reporting/reportingsGeometryHelpers'
import { getVigilanceAreaZoneFeature } from '@features/VigilanceArea/components/VigilanceAreaLayer/vigilanceAreaGeometryHelper'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { WSG84_PROJECTION, OPENLAYERS_PROJECTION } from '@mtes-mct/monitor-ui'
import { Layers } from 'domain/entities/layers/constants'
import { getOverlayCoordinates } from 'domain/shared_slices/Global'
import { Feature } from 'ol'
import { GeoJSON } from 'ol/format'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { useRef, type MutableRefObject, useEffect } from 'react'

import { getDashboardStyle } from './style'

import type { BaseMapChildrenProps } from '@features/map/BaseMap'
import type { VectorLayerWithName } from 'domain/types/layer'
import type { Geometry } from 'ol/geom'

export function SelectedDashboardLayer({ map }: BaseMapChildrenProps) {
  const dispatch = useAppDispatch()
  const { displayDashboardLayer } = useAppSelector(state => state.global.layers)
  const selectedDashboardOnMap = useAppSelector(state => state.dashboard.selectedDashboardOnMap)

  const isolatedLayer = useAppSelector(state => state.map.isolatedLayer)

  const dashboardDatasVectorSourceRef = useRef(new VectorSource()) as MutableRefObject<VectorSource<Feature<Geometry>>>
  const dashboardDatasVectorLayerRef = useRef(
    new VectorLayer({
      renderBuffer: 7,
      source: dashboardDatasVectorSourceRef.current,
      style: feature => getDashboardStyle(feature),
      zIndex: Layers.DASHBOARDS.zIndex
    })
  ) as MutableRefObject<VectorLayerWithName>
  dashboardDatasVectorLayerRef.current.name = Layers.DASHBOARDS.code

  useEffect(() => {
    if (map) {
      map.getLayers().push(dashboardDatasVectorLayerRef.current)

      // eslint-disable-next-line react-hooks/exhaustive-deps
      return () => map.removeLayer(dashboardDatasVectorLayerRef.current)
    }

    return () => {}
  }, [map])

  const overlayCoordinates = useAppSelector(state =>
    getOverlayCoordinates(state.global, `${Layers.DASHBOARDS.code}:${selectedDashboardOnMap?.id}`)
  )

  useEffect(() => {
    const feature = dashboardDatasVectorSourceRef.current.getFeatureById(
      `${Layers.DASHBOARDS.code}:${selectedDashboardOnMap?.id}`
    )

    feature?.setProperties({ overlayCoordinates })
  }, [overlayCoordinates, selectedDashboardOnMap])

  useEffect(() => {
    dashboardDatasVectorLayerRef.current?.setVisible(displayDashboardLayer)
  }, [displayDashboardLayer])

  useEffect(() => {
    dashboardDatasVectorSourceRef.current.clear(true)
    if (selectedDashboardOnMap) {
      const geoJSON = new GeoJSON()

      const geometry = geoJSON.readGeometry(selectedDashboardOnMap.geom, {
        dataProjection: WSG84_PROJECTION,
        featureProjection: OPENLAYERS_PROJECTION
      })
      const feats: Feature[] = []
      const feat = new Feature({ geometry })

      feat.setStyle([measurementStyle(), measurementStyleWithCenter, overlayStroke])
      feat.setId(`${Layers.DASHBOARDS.code}:${selectedDashboardOnMap?.id}`)
      feats.push(feat)
      selectedDashboardOnMap.reportings.forEach(reporting => {
        const reportingFeature = getReportingZoneFeature(reporting, Dashboard.featuresCode.DASHBOARD_REPORTINGS)

        feats.push(reportingFeature)
      })
      selectedDashboardOnMap.amps.forEach(amp => {
        const ampFeature = getAMPFeature({
          code: Dashboard.featuresCode.DASHBOARD_AMP,
          isolatedLayer,
          layer: amp
        })

        if (!ampFeature) {
          return feats
        }

        return feats.push(ampFeature)
      })
      selectedDashboardOnMap.regulatoryAreas.forEach(regulatoryArea => {
        const regulatoryAreaFeature = getRegulatoryFeature({
          code: Dashboard.featuresCode.DASHBOARD_REGULATORY_AREAS,
          isolatedLayer,
          layer: regulatoryArea
        })
        if (!regulatoryAreaFeature) {
          return feats
        }

        return feats.push(regulatoryAreaFeature)
      })
      selectedDashboardOnMap.vigilanceAreas.forEach(vigilanceArea => {
        const vigilanceAreaFeature = getVigilanceAreaZoneFeature(
          vigilanceArea,
          Dashboard.featuresCode.DASHBOARD_VIGILANCE_AREAS,
          isolatedLayer
        )

        feats.push(vigilanceAreaFeature)
      })

      dashboardDatasVectorSourceRef.current?.addFeatures(feats)
    }
  }, [dispatch, selectedDashboardOnMap, isolatedLayer])
}
