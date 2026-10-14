import { getDashboardById } from '@features/Dashboard/slice'
import { Dashboard } from '@features/Dashboard/types'
import { getAMPFeature } from '@features/map/layers/AMP/AMPGeometryHelpers'
import { getRegulatoryFeature } from '@features/map/layers/Regulatory/regulatoryGeometryHelpers'
import { getReportingZoneFeature } from '@features/Reportings/components/ReportingLayer/Reporting/reportingsGeometryHelpers'
import { getVigilanceAreaZoneFeature } from '@features/VigilanceArea/components/VigilanceAreaLayer/vigilanceAreaGeometryHelper'
import { useAppSelector } from '@hooks/useAppSelector'
import { Layers } from 'domain/entities/layers/constants'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { useCallback, useEffect, useMemo, useRef } from 'react'

import { getDashboardStyle } from './style'

import type { BaseMapChildrenProps } from '@features/map/BaseMap'
import type { VectorLayerWithName } from 'domain/types/layer'
import type { Feature } from 'ol'
import type { Geometry } from 'ol/geom'

export function DashboardPreviewLayer({ map }: BaseMapChildrenProps) {
  const isolatedLayer = useAppSelector(state => state.map.isolatedLayer)

  const activeDashboardId = useAppSelector(state => state.dashboard.activeDashboardId)

  const dashboard = useAppSelector(state => getDashboardById(state.dashboard, activeDashboardId))
  const openPanel = dashboard?.openPanel

  const isLayerVisible = !!dashboard

  const drawBorder = useCallback(
    (layerId: number, feature: Feature<Geometry>, type: Dashboard.Block) => {
      if (layerId === openPanel?.id && openPanel.type === type) {
        feature.set('metadataIsShowed', true)
      }
    },
    [openPanel]
  )

  const extractedRegulatoryAreas = useMemo(() => dashboard?.extractedArea?.regulatoryAreas ?? [], [dashboard])
  const extractedAmps = useMemo(() => dashboard?.extractedArea?.amps ?? [], [dashboard])
  const extractedVigilanceAreas = useMemo(() => dashboard?.extractedArea?.vigilanceAreas ?? [], [dashboard])

  const regulatoryAreas = useMemo(() => {
    let filteredRegulatoryAreas = extractedRegulatoryAreas.filter(regulatoryArea =>
      dashboard?.regulatoryIdsToDisplay.includes(regulatoryArea.id)
    )

    if (
      openPanel?.type === Dashboard.Block.REGULATORY_AREAS &&
      !dashboard?.regulatoryIdsToDisplay.includes(openPanel.id)
    ) {
      const openedRegulatoryArea = extractedRegulatoryAreas.find(area => area.id === openPanel.id)
      if (openedRegulatoryArea) {
        filteredRegulatoryAreas = [...filteredRegulatoryAreas, openedRegulatoryArea]
      }
    }

    return filteredRegulatoryAreas
  }, [extractedRegulatoryAreas, dashboard?.regulatoryIdsToDisplay, openPanel])

  const amps = useMemo(() => {
    let filteredAmps = extractedAmps.filter(({ id }) => dashboard?.ampIdsToDisplay.includes(id))

    if (openPanel?.type === Dashboard.Block.AMP && !dashboard?.ampIdsToDisplay.includes(openPanel.id)) {
      const panel = extractedAmps.find(({ id }) => id === openPanel.id)
      if (panel) {
        filteredAmps = [...filteredAmps, panel]
      }
    }

    return filteredAmps
  }, [extractedAmps, dashboard?.ampIdsToDisplay, openPanel])

  const vigilanceArea = useMemo(() => {
    if (openPanel?.type === Dashboard.Block.VIGILANCE_AREAS) {
      return extractedVigilanceAreas.find(({ id }) => id === openPanel.id)
    }

    return undefined
  }, [openPanel, extractedVigilanceAreas])

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
        const regulatoryAreasFeatures = regulatoryAreas.reduce((feats: Feature[], layer) => {
          if (layer && layer?.extent) {
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

        previewLayersVectorSourceRef.current.addFeatures(regulatoryAreasFeatures)

        // AMP
        const ampFeatures = amps.reduce((feats: Feature[], layer) => {
          if (layer && layer?.extent) {
            const feature = getAMPFeature({ code: Dashboard.featuresCode.DASHBOARD_AMP, isolatedLayer, layer })
            if (!feature) {
              return feats
            }
            drawBorder(layer.id, feature, Dashboard.Block.AMP)
            feats.push(feature)
          }

          return feats
        }, [])

        previewLayersVectorSourceRef.current.addFeatures(ampFeatures ?? [])

        // Vigilance Areas
        if (vigilanceArea?.geom && vigilanceArea?.geom?.coordinates.length > 0) {
          const vigilanceAreafeature = getVigilanceAreaZoneFeature(
            vigilanceArea,
            Dashboard.featuresCode.DASHBOARD_VIGILANCE_AREAS,
            isolatedLayer
          )
          vigilanceAreafeature.set('isSelected', true)

          previewLayersVectorSourceRef.current.addFeature(vigilanceAreafeature)
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
  }, [
    dashboard,
    drawBorder,
    map,
    openPanel,
    regulatoryAreas,
    isolatedLayer,
    extractedAmps,
    extractedVigilanceAreas,
    amps,
    vigilanceArea
  ])

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
