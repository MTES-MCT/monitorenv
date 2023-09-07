import { THEME } from '@mtes-mct/monitor-ui'
import { getCenter } from 'ol/extent'
import { Point } from 'ol/geom'
import { Fill, Icon, Stroke, Style } from 'ol/style'

import { OLGeometryType } from '../../../../domain/entities/map/constants'
import { ReportingStatusEnum, ReportingTypeEnum, getReportingStatus } from '../../../../domain/entities/reporting'
import { getColorWithAlpha } from '../../../../utils/utils'

const reportingStyleFactory = (color, src?: string | undefined) =>
  new Style({
    geometry: feature => {
      const extent = feature?.getGeometry()?.getExtent()
      const center = extent && getCenter(extent)

      return center && new Point(center)
    },
    image: new Icon({
      color,
      displacement: [5, 18],
      src: src || 'report.svg'
    })
  })

const hoveredReportingZoneStyleFactory = (color, fillColor) => [
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
  }),
  new Style({
    geometry: feature => {
      const geometry = feature.getGeometry()
      if (geometry?.getType() === OLGeometryType.MULTIPOINT) {
        return feature.getGeometry()
      }

      return undefined
    },
    image: new Icon({
      color,
      scale: 0.6,
      src: 'Close.svg'
    })
  })
]

const selectedReportingStyleFactory = (color, fillColor) => [
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
  }),
  new Style({
    geometry: feature => {
      const geometry = feature.getGeometry()
      if (geometry?.getType() === OLGeometryType.MULTIPOINT) {
        return feature.getGeometry()
      }

      return undefined
    },
    image: new Icon({
      color,
      scale: 0.6,
      src: 'Close.svg'
    })
  })
]

export const hoveredReportingStyleFn = feature => {
  const status = getReportingStatus({
    createdAt: feature.get('createdAt'),
    isArchived: feature.get('isArchived'),
    reportType: feature.get('reportType') as ReportingTypeEnum,
    validityTime: feature.get('validityTime')
  })

  switch (status) {
    case ReportingStatusEnum.OBSERVATION:
      return hoveredReportingZoneStyleFactory(
        THEME.color.blueGray[100],
        getColorWithAlpha(THEME.color.blueGray[100], 0.2)
      )
    case ReportingStatusEnum.INFRACTION_SUSPICION:
      return hoveredReportingZoneStyleFactory(THEME.color.maximumRed, getColorWithAlpha(THEME.color.maximumRed, 0.2))
    case ReportingStatusEnum.ARCHIVED:
      if (feature.get('reportType') === ReportingTypeEnum.OBSERVATION) {
        return hoveredReportingZoneStyleFactory(THEME.color.blueGray[100], getColorWithAlpha(THEME.color.white, 0.6))
      }

      return hoveredReportingZoneStyleFactory(THEME.color.maximumRed, getColorWithAlpha(THEME.color.white, 0.6))
    case ReportingStatusEnum.IN_PROGRESS:
    default:
      return hoveredReportingZoneStyleFactory(THEME.color.slateGray, getColorWithAlpha(THEME.color.slateGray, 0.2))
  }
}

export const selectedReportingStyleFn = feature => {
  const status = getReportingStatus({
    createdAt: feature.get('createdAt'),
    isArchived: feature.get('isArchived'),
    reportType: feature.get('reportType') as ReportingTypeEnum,
    validityTime: feature.get('validityTime')
  })

  switch (status) {
    case ReportingStatusEnum.OBSERVATION:
      return selectedReportingStyleFactory(
        THEME.color.blueGray[100],
        getColorWithAlpha(THEME.color.blueGray[100], 0.25)
      )
    case ReportingStatusEnum.INFRACTION_SUSPICION:
      return selectedReportingStyleFactory(THEME.color.maximumRed, getColorWithAlpha(THEME.color.maximumRed, 0.25))

    case ReportingStatusEnum.ARCHIVED:
      if (feature.get('reportType') === ReportingTypeEnum.OBSERVATION) {
        return selectedReportingStyleFactory(THEME.color.blueGray[100], getColorWithAlpha(THEME.color.white, 0.6))
      }

      return selectedReportingStyleFactory(THEME.color.maximumRed, getColorWithAlpha(THEME.color.white, 0.6))

    case ReportingStatusEnum.IN_PROGRESS:
    default:
      return selectedReportingStyleFactory(THEME.color.slateGray, getColorWithAlpha(THEME.color.slateGray, 0.25))
  }
}

// TODO handle case when reporting is attach to a mission
export const reportingPinStyleFn = feature => {
  const status = getReportingStatus({
    createdAt: feature.get('createdAt'),
    isArchived: feature.get('isArchived'),
    reportType: feature.get('reportType') as ReportingTypeEnum,
    validityTime: feature.get('validityTime')
  })

  switch (status) {
    case ReportingStatusEnum.OBSERVATION:
      return reportingStyleFactory(THEME.color.blueGray[100])
    case ReportingStatusEnum.INFRACTION_SUSPICION:
      return reportingStyleFactory(THEME.color.maximumRed)

    case ReportingStatusEnum.ARCHIVED:
      if (feature.get('reportType') === ReportingTypeEnum.OBSERVATION) {
        return reportingStyleFactory(THEME.color.white, 'archived_reporting_observation.svg')
      }

      return reportingStyleFactory(THEME.color.white, 'archived_reporting_infraction.svg')
    case ReportingStatusEnum.IN_PROGRESS:
    default:
      return reportingStyleFactory(THEME.color.slateGray)
  }
}

export const editingReportingStyleFn = feature => [reportingPinStyleFn(feature), ...selectedReportingStyleFn(feature)]
