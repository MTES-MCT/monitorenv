import { THEME } from '@mtes-mct/monitor-ui'
import { getCenter } from 'ol/extent'
import { Point } from 'ol/geom'
import { Fill, Icon, Stroke, Style } from 'ol/style'

import { ReportingTypeEnum } from '../../../../domain/entities/reporting'

export const hoveredReportingZoneStyleFactory = (color, fillColor) =>
  new Style({
    fill: new Fill({
      color: fillColor
    }),
    stroke: new Stroke({
      color,
      lineCap: 'square',
      lineDash: [2, 8],
      width: 4
    })
  })

export const hoveredReportingStyleFactory = feature => {
  const isProven = feature.get('isInfractionProven')
  const reportingType = feature.get('reportType')

  if (reportingType === ReportingTypeEnum.OBSERVATION) {
    return hoveredReportingZoneStyleFactory(THEME.color.blueGray[100], 'rgb(86, 151, 210, .2)')
  }

  if (isProven === undefined || isProven === null) {
    return hoveredReportingZoneStyleFactory(THEME.color.slateGray, 'rgba(112, 119, 133, .2)')
  }
  if (isProven && reportingType === ReportingTypeEnum.INFRACTION) {
    return hoveredReportingZoneStyleFactory(THEME.color.maximumRed, 'rgba(225, 0, 15, .2)')
  }

  return hoveredReportingZoneStyleFactory(THEME.color.white, 'rgb(255, 255, 255, .2)')
}

export const selectedReportingStyleFactory = feature => {
  const isProven = feature.get('isInfractionProven')
  const reportingType = feature.get('reportType')

  if (reportingType === ReportingTypeEnum.OBSERVATION) {
    return selectedReportingStyle(THEME.color.blueGray[100], 'rgb(86, 151, 210, .25)')
  }

  if (isProven === undefined || isProven === null) {
    return selectedReportingStyle(THEME.color.slateGray, 'rgba(112, 119, 133, .25)')
  }
  if (isProven && reportingType === ReportingTypeEnum.INFRACTION) {
    return selectedReportingStyle(THEME.color.maximumRed, 'rgba(225, 0, 15, .25)')
  }

  return selectedReportingStyle(THEME.color.white, 'rgb(255, 255, 255, .25)')
}

export const selectedReportingStyle = (color, fillColor) =>
  new Style({
    fill: new Fill({
      color: fillColor
    }),
    stroke: new Stroke({
      color,
      lineCap: 'square',
      lineDash: [2, 8],
      width: 5
    })
  })

// TODO handle case when reporting is attach to a mission
export const styleReporting = feature => {
  const isProven = feature.get('isInfractionProven')
  const reportingType = feature.get('reportType')

  if (reportingType === ReportingTypeEnum.OBSERVATION) {
    return reportingStyleFactory(THEME.color.blueGray[100])
  }

  if (isProven === undefined || isProven === null) {
    return reportingStyleFactory(THEME.color.charcoal)
  }
  if (isProven && reportingType === ReportingTypeEnum.INFRACTION) {
    return reportingStyleFactory(THEME.color.maximumRed)
  }

  return reportingStyleFactory(THEME.color.white, 'archived_reporting.svg')
}

export const reportingStyleFactory = (color, src?: string | undefined) =>
  new Style({
    geometry: feature => {
      const extent = feature?.getGeometry()?.getExtent()
      const center = extent && getCenter(extent)

      return center && new Point(center)
    },
    image: new Icon({
      color,
      src: src || 'report.svg'
    })
  })
