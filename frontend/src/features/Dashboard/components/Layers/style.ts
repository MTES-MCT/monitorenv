import { Dashboard } from '@features/Dashboard/types'
import { getAMPLayerStyle } from '@features/map/layers/AMP/AMPLayers.style'
import { getRegulatoryLayerStyle } from '@features/map/layers/styles/administrativeAndRegulatoryLayers.style'
import { editingReportingStyleFn } from '@features/Reportings/components/ReportingLayer/Reporting/style'
import { getVigilanceAreaLayerStyle } from '@features/VigilanceArea/components/VigilanceAreaLayer/style'

export const getDashboardStyle = feature => {
  const featureType = feature.getId().split(':')[0]

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
    return editingReportingStyleFn(feature)
  }

  return undefined
}
