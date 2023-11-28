import { OPENLAYERS_PROJECTION, THEME, WSG84_PROJECTION } from '@mtes-mct/monitor-ui'
import { isEmpty } from 'lodash'
import { getCenter } from 'ol/extent'
import { GeoJSON } from 'ol/format'
import { LineString, Point } from 'ol/geom'
import { Fill, Icon, Stroke, Style, Circle } from 'ol/style'

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
  }),
  new Style({
    geometry: feature => {
      const overlayPostion = feature.get('overlayCoordinates')
      if (isEmpty(overlayPostion)) {
        return undefined
      }

      const extent = feature?.getGeometry()?.getExtent()
      const center = extent && getCenter(extent)
      if (!center) {
        return undefined
      }

      return new LineString([overlayPostion.coordinates, center])
    },
    stroke: new Stroke({
      color: THEME.color.slateGray,
      lineDash: [4, 4],
      width: 2
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

  if (feature.get('missionId') && !feature.get('detachedFromMissionAtUtc')) {
    if (status === ReportingStatusEnum.ARCHIVED) {
      return hoveredReportingZoneStyleFactory(THEME.color.mediumSeaGreen, getColorWithAlpha(THEME.color.white, 0.2))
    }

    return hoveredReportingZoneStyleFactory(
      THEME.color.mediumSeaGreen,
      getColorWithAlpha(THEME.color.mediumSeaGreen, 0.2)
    )
  }

  switch (status) {
    case ReportingStatusEnum.OBSERVATION:
      return hoveredReportingZoneStyleFactory(THEME.color.blueGray, getColorWithAlpha(THEME.color.blueGray, 0.2))
    case ReportingStatusEnum.INFRACTION_SUSPICION:
      return hoveredReportingZoneStyleFactory(THEME.color.maximumRed, getColorWithAlpha(THEME.color.maximumRed, 0.2))
    case ReportingStatusEnum.ARCHIVED:
      if (feature.get('reportType') === ReportingTypeEnum.OBSERVATION) {
        return hoveredReportingZoneStyleFactory(THEME.color.blueGray, getColorWithAlpha(THEME.color.white, 0.6))
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

  if (feature.get('missionId') && !feature.get('detachedFromMissionAtUtc')) {
    if (status === ReportingStatusEnum.ARCHIVED) {
      return selectedReportingStyleFactory(THEME.color.mediumSeaGreen, getColorWithAlpha(THEME.color.white, 0.25))
    }

    return selectedReportingStyleFactory(
      THEME.color.mediumSeaGreen,
      getColorWithAlpha(THEME.color.mediumSeaGreen, 0.25)
    )
  }

  switch (status) {
    case ReportingStatusEnum.OBSERVATION:
      return selectedReportingStyleFactory(THEME.color.blueGray, getColorWithAlpha(THEME.color.blueGray, 0.25))
    case ReportingStatusEnum.INFRACTION_SUSPICION:
      return selectedReportingStyleFactory(THEME.color.maximumRed, getColorWithAlpha(THEME.color.maximumRed, 0.25))

    case ReportingStatusEnum.ARCHIVED:
      if (feature.get('reportType') === ReportingTypeEnum.OBSERVATION) {
        return selectedReportingStyleFactory(THEME.color.blueGray, getColorWithAlpha(THEME.color.white, 0.6))
      }

      return selectedReportingStyleFactory(THEME.color.maximumRed, getColorWithAlpha(THEME.color.white, 0.6))

    case ReportingStatusEnum.IN_PROGRESS:
    default:
      return selectedReportingStyleFactory(THEME.color.slateGray, getColorWithAlpha(THEME.color.slateGray, 0.25))
  }
}

export const reportingPinStyleFn = feature => {
  const status = getReportingStatus({
    createdAt: feature.get('createdAt'),
    isArchived: feature.get('isArchived'),
    reportType: feature.get('reportType') as ReportingTypeEnum,
    validityTime: feature.get('validityTime')
  })

  if (!!feature.get('missionId') && !feature.get('detachedFromMissionAtUtc')) {
    if (status === ReportingStatusEnum.ARCHIVED) {
      return reportingStyleFactory(THEME.color.white, 'archived_reporting_with_mission_attached.svg')
    }

    return reportingStyleFactory(THEME.color.mediumSeaGreen)
  }

  switch (status) {
    case ReportingStatusEnum.OBSERVATION:
      return reportingStyleFactory(THEME.color.blueGray)
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

const reportingToMissionLinkStyle = feature =>
  new Style({
    geometry: () => {
      const missionId = feature.get('missionId')
      if (!missionId || (missionId && feature.get('detachedFromMissionAtUtc'))) {
        return undefined
      }
      const reportingExtent = feature?.getGeometry()?.getExtent()
      const reportingCenter = reportingExtent && getCenter(reportingExtent)

      const missionGeom = feature.get('attachedMission')?.geom
      const geoJSON = new GeoJSON()
      const formattedMissionGeometry = geoJSON.readGeometry(missionGeom, {
        dataProjection: WSG84_PROJECTION,
        featureProjection: OPENLAYERS_PROJECTION
      })

      const missionExtent = formattedMissionGeometry?.getExtent()
      const missionCenter = missionExtent && getCenter(missionExtent)

      if (!reportingCenter || !missionCenter) {
        return undefined
      }

      return new LineString([reportingCenter, missionCenter])
    },
    stroke: new Stroke({
      color: THEME.color.charcoal,
      width: 1
    })
  })

const attachedMissionCircleStyle = feature =>
  new Style({
    geometry: () => {
      const missionId = feature.get('missionId')
      if (!missionId || (missionId && feature.get('detachedFromMissionAtUtc'))) {
        return undefined
      }

      const missionGeom = feature.get('attachedMission')?.geom
      const geoJSON = new GeoJSON()
      const formattedMissionGeometry = geoJSON.readGeometry(missionGeom, {
        dataProjection: WSG84_PROJECTION,
        featureProjection: OPENLAYERS_PROJECTION
      })

      const missionExtent = formattedMissionGeometry?.getExtent()
      const missionCenter = missionExtent && getCenter(missionExtent)

      return missionCenter && new Point(missionCenter)
    },
    image: new Circle({
      radius: 20,
      stroke: new Stroke({
        color: THEME.color.charcoal,
        width: 2
      })
    })
  })

export const editingReportingStyleFn = feature => [
  reportingPinStyleFn(feature),
  ...selectedReportingStyleFn(feature),
  reportingToMissionLinkStyle(feature),
  attachedMissionCircleStyle(feature)
]
