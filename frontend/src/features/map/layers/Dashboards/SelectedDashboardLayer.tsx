import { Dashboard } from '@features/Dashboard/types'
import { getReportingZoneFeature } from '@features/Reportings/components/ReportingLayer/Reporting/reportingsGeometryHelpers'
import { editingReportingStyleFn } from '@features/Reportings/components/ReportingLayer/Reporting/style'
import { getVigilanceAreaLayerStyle } from '@features/VigilanceArea/components/VigilanceAreaLayer/style'
import { getVigilanceAreaZoneFeature } from '@features/VigilanceArea/components/VigilanceAreaLayer/vigilanceAreaGeometryHelper'
import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '@mtes-mct/monitor-ui'
import { Feature } from 'ol'
import { GeoJSON as OLGeoJSON } from 'ol/format'
import { type Geometry } from 'ol/geom'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { useEffect, useRef, type MutableRefObject } from 'react'

import { Layers } from '../../../../domain/entities/layers/constants'
import { useAppDispatch } from '../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { getAMPFeature } from '../AMP/AMPGeometryHelpers'
import { getAMPLayerStyle } from '../AMP/AMPLayers.style'
import { getRegulatoryFeature } from '../Regulatory/regulatoryGeometryHelpers'
import { getRegulatoryLayerStyle } from '../styles/administrativeAndRegulatoryLayers.style'
import { measurementStyle, measurementStyleWithCenter } from '../styles/measurement.style'

import type { BaseMapChildrenProps } from '../../BaseMap'
import type { VectorLayerWithName } from 'domain/types/layer'

export function SelectedDashboardLayer({ map }: BaseMapChildrenProps) {
  const dispatch = useAppDispatch()
  const { displayDashboardLayer } = useAppSelector(state => state.global)
  const selectedDashboardOnMap = useAppSelector(state => state.dashboard.selectedDashboardOnMap)

  const dashboardDatasVectorSourceRef = useRef(new VectorSource()) as MutableRefObject<VectorSource<Feature<Geometry>>>
  const dashboardDatasVectorLayerRef = useRef(
    new VectorLayer({
      renderBuffer: 7,
      source: dashboardDatasVectorSourceRef.current,
      updateWhileAnimating: true,
      updateWhileInteracting: true,
      zIndex: Layers.DASHBOARDS.zIndex
    })
  ) as MutableRefObject<VectorLayerWithName>
  ;(dashboardDatasVectorLayerRef.current as VectorLayerWithName).name = Layers.DASHBOARDS.code

  useEffect(() => {
    if (map) {
      map.getLayers().push(dashboardDatasVectorLayerRef.current)

      // eslint-disable-next-line react-hooks/exhaustive-deps
      return () => map.removeLayer(dashboardDatasVectorLayerRef.current)
    }

    return () => {}
  }, [map])

  useEffect(() => {
    dashboardDatasVectorLayerRef.current?.setVisible(displayDashboardLayer)
  }, [displayDashboardLayer])

  useEffect(() => {
    dashboardDatasVectorSourceRef.current.clear(true)
    if (selectedDashboardOnMap) {
      const geoJSON = new OLGeoJSON()

      const geometry = geoJSON.readGeometry(selectedDashboardOnMap.geom, {
        dataProjection: WSG84_PROJECTION,
        featureProjection: OPENLAYERS_PROJECTION
      })
      const feats: Feature[] = []
      const feat = new Feature({ geometry })
      feat.setStyle([measurementStyle, measurementStyleWithCenter])
      feats.push(feat)
      selectedDashboardOnMap.reportings.forEach(reporting => {
        const reportingFeature = getReportingZoneFeature(reporting, Dashboard.featuresCode.DASHBOARD_REPORTINGS)
        reportingFeature.setStyle(editingReportingStyleFn)

        feats.push(reportingFeature)
      })
      selectedDashboardOnMap.amps.forEach(amp => {
        const ampFeature = getAMPFeature({ code: Dashboard.featuresCode.DASHBOARD_AMP, layer: amp })

        ampFeature.setStyle(getAMPLayerStyle(ampFeature))

        feats.push(ampFeature)
      })
      selectedDashboardOnMap.regulatoryAreas.forEach(regulatoryArea => {
        const regulatoryAreaFeature = getRegulatoryFeature({
          code: Dashboard.featuresCode.DASHBOARD_REGULATORY_AREAS,
          layer: regulatoryArea
        })
        regulatoryAreaFeature.setStyle(getRegulatoryLayerStyle(regulatoryAreaFeature))

        feats.push(regulatoryAreaFeature)
      })
      selectedDashboardOnMap.vigilanceAreas.forEach(vigilanceArea => {
        const vigilanceAreaFeature = getVigilanceAreaZoneFeature(
          vigilanceArea,
          Dashboard.featuresCode.DASHBOARD_VIGILANCE_AREAS
        )
        vigilanceAreaFeature.setStyle(getVigilanceAreaLayerStyle(vigilanceAreaFeature))

        feats.push(vigilanceAreaFeature)
      })

      dashboardDatasVectorSourceRef.current?.addFeatures(feats)
    }
  }, [dispatch, selectedDashboardOnMap])
}
