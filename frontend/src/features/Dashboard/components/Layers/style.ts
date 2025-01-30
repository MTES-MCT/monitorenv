import { Dashboard } from '@features/Dashboard/types'
import { getAMPLayerStyle } from '@features/map/layers/AMP/AMPLayers.style'
import { getRegulatoryLayerStyle } from '@features/map/layers/styles/administrativeAndRegulatoryLayers.style'
import { editingReportingStyleFn } from '@features/Reportings/components/ReportingLayer/Reporting/style'
import { getVigilanceAreaLayerStyle } from '@features/VigilanceArea/components/VigilanceAreaLayer/style'
import { getCenter } from 'ol/extent'
import { Point } from 'ol/geom'
import { Icon, Style } from 'ol/style'

import type { FeatureLike } from 'ol/Feature'

export const getDashboardStyle = (feature: FeatureLike) => {
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
    return editingReportingStyleFn(feature, { withLinkedMissions: false })
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
