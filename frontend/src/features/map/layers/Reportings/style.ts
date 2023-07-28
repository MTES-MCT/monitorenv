import { THEME } from '@mtes-mct/monitor-ui'
import { getCenter } from 'ol/extent'
import { Point } from 'ol/geom'
import { Fill, Icon, Stroke, Style } from 'ol/style'

import { ReportingTypeEnum } from '../../../../domain/entities/reporting'

export const selectedReportingStyle = new Style({
  fill: new Fill({
    color: 'rgba(86, 151, 210, .25)' // Blue Gray
  }),
  stroke: new Stroke({
    color: THEME.color.charcoal,
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

  // TODO change color to hae backgroung in white and border in slateGray
  return reportingStyleFactory(THEME.color.white)
}

export const reportingStyleFactory = color =>
  new Style({
    geometry: feature => {
      const extent = feature?.getGeometry()?.getExtent()
      const center = extent && getCenter(extent)

      return center && new Point(center)
    },
    image: new Icon({
      color,
      src: 'report.svg'
    })
  })
