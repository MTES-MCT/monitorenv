import { THEME } from '@mtes-mct/monitor-ui'
import { getCenter } from 'ol/extent'
import Point from 'ol/geom/Point'
import { Stroke, Style, Circle, Icon } from 'ol/style'

import { ReportingTypeEnum } from '../../../../domain/entities/reporting'

export const reportingToAttachStyle = feature => {
  const reportingType = feature.get('reportType')

  return new Style({
    geometry: () => {
      const extent = feature?.getGeometry()?.getExtent()
      const center = extent && getCenter(extent)

      return center && new Point(center)
    },
    image: new Icon({
      color: reportingType === ReportingTypeEnum.OBSERVATION ? THEME.color.blueGray : THEME.color.maximumRed,
      src: 'report.svg'
    })
  })
}

export const selectedReportingToAttachStyle = new Style({
  geometry: feature => {
    const extent = feature?.getGeometry()?.getExtent()
    const center = extent && getCenter(extent)

    return center && new Point(center)
  },
  image: new Circle({
    radius: 20,
    stroke: new Stroke({
      color: THEME.color.charcoal,
      width: 2
    })
  })
})

export const attachedReportingStyle = feature => [reportingToAttachStyle(feature), selectedReportingToAttachStyle]
