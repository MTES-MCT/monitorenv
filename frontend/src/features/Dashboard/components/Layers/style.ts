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

import type { Color } from 'ol/color'
import type { ColorLike } from 'ol/colorlike'
import type { Coordinate } from 'ol/coordinate'
import type { FeatureLike } from 'ol/Feature'

function getOrientation(reference: number | undefined, point: number | undefined) {
  return (point ?? 0) < (reference ?? 0) ? 'left' : 'right'
}

export const getDashboardStyle = (
  feature: FeatureLike,
  {
    viewCenter,
    withReportingOverlay = false
  }: { viewCenter?: Coordinate | undefined; withReportingOverlay?: boolean } = {}
) => {
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
      const point = center && new Point(center)
      reportingStyles.push(
        reportingOverlay(
          feature,
          point,
          reportingStyles[1]?.getStroke()?.getColor(),
          getOrientation(viewCenter?.[0], point?.getCoordinates()[0])
        )
      )
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

const reportingOverlay = (
  feature: FeatureLike,
  point: Point | undefined,
  reportingColor: Color | ColorLike | undefined,
  orientation: 'left' | 'right'
) => {
  const isArchived = feature.get('isArchived')

  return new Style({
    geometry: point,
    text: new Text({
      backgroundFill: new Fill({
        color: isArchived ? THEME.color.white : reportingColor
      }),
      backgroundStroke: new Stroke({
        color: isArchived ? reportingColor : THEME.color.white
      }),
      fill: new Fill({ color: isArchived ? THEME.color.gunMetal : THEME.color.white }),
      font: '12px Marianne',
      offsetX: orientation === 'left' ? -55 : 55,
      offsetY: -18,
      padding: [2, 8, 2, 8],
      text: getFormattedReportingId(feature.get('reportingId'))
    })
  })
}
