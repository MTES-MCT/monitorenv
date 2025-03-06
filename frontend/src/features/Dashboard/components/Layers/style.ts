import { Dashboard } from '@features/Dashboard/types'
import { getAMPLayerStyle } from '@features/map/layers/AMP/AMPLayers.style'
import { getRegulatoryLayerStyle } from '@features/map/layers/styles/administrativeAndRegulatoryLayers.style'
import { editingReportingStyleFn } from '@features/Reportings/components/ReportingLayer/Reporting/style'
import { getFormattedReportingId } from '@features/Reportings/utils'
import { getVigilanceAreaLayerStyle } from '@features/VigilanceArea/components/VigilanceAreaLayer/style'
import { THEME } from '@mtes-mct/monitor-ui'
import { getCenter } from 'ol/extent'
import { Point } from 'ol/geom'
import { Fill, Icon, Stroke, Style, Text } from 'ol/style'

import type { FeatureLike } from 'ol/Feature'

export const getDashboardStyle = (feature: FeatureLike, { withReportingOverlay = false } = {}) => {
  const featureId = String(feature.getId())
  if (!featureId) {
    return undefined
  }
  const featureType = featureId.split(':')[0]

  if (featureType === Dashboard.Layer.DASHBOARD_REGULATORY_AREAS) {
    return getRegulatoryLayerStyle(feature)
  }

  if (featureType === Dashboard.Layer.DASHBOARD_AMP) {
    return getAMPLayerStyle(feature)
  }

  if (featureType === Dashboard.Layer.DASHBOARD_VIGILANCE_AREAS) {
    return getVigilanceAreaLayerStyle(feature)
  }

  if (featureType === Dashboard.Layer.DASHBOARD_REPORTINGS) {
    const reportingStyles = editingReportingStyleFn(feature, { withLinkedMissions: false })
    if (withReportingOverlay) {
      const geometry = feature.getGeometry()
      const center = geometry?.getExtent() && getCenter(geometry?.getExtent())
      const isArchived = feature.get('isArchived')

      const reportingOverlay = new Style({
        geometry: center && new Point(center),
        text: new Text({
          backgroundFill: new Fill({
            color: isArchived ? THEME.color.white : reportingStyles[1]?.getStroke()?.getColor()
          }),
          backgroundStroke: new Stroke({
            color: isArchived ? reportingStyles[1]?.getStroke()?.getColor() : THEME.color.white
          }),
          fill: new Fill({ color: isArchived ? THEME.color.gunMetal : THEME.color.white }),
          font: '12px Marianne',
          offsetX: 50,
          offsetY: -16,
          padding: [2, 8, 2, 8],
          text: getFormattedReportingId(feature.get('reportingId'))
        })
      })
      reportingStyles.push(reportingOverlay)
    }

    return reportingStyles
  }

  return undefined
}

export const dashboardIcon = () =>
  new Style({
    geometry: feature => {
      const extent = feature?.getGeometry()?.getExtent()
      const center = extent && getCenter(extent)

      return center && new Point(center)
    },
    image: new Icon({
      src: 'icons/bullseye_border.svg'
    })
  })
