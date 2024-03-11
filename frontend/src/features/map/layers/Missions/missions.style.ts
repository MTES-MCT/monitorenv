import { OPENLAYERS_PROJECTION, THEME, WSG84_PROJECTION } from '@mtes-mct/monitor-ui'
import { getCenter } from 'ol/extent'
import { GeoJSON } from 'ol/format'
import { LineString, MultiPoint, MultiPolygon } from 'ol/geom'
import Point from 'ol/geom/Point'
import { Circle, Icon, Style } from 'ol/style'
import Fill from 'ol/style/Fill'
import Stroke from 'ol/style/Stroke'

import { ActionTypeEnum, MissionStatusEnum, MissionTypeEnum } from '../../../../domain/entities/missions'

export const missionZoneStyle = new Style({
  fill: new Fill({
    color: 'rgba(86, 151, 210, .2)' // Blue Gray
  }),
  stroke: new Stroke({
    color: THEME.color.charcoal,
    lineCap: 'square',
    lineDash: [2, 8],
    width: 4
  })
})

const missionWithCentroidStyleFactory = (status, type) =>
  new Style({
    geometry: feature => {
      const extent = feature?.getGeometry()?.getExtent()
      const center = extent && getCenter(extent)

      return center && new Point(center)
    },
    image: new Icon({
      displacement: [0, 24],
      scale: 0.5,
      src: `mission/${status}_${type}.png`
    })
  })

export const missionWithCentroidStyleFn = feature => {
  const missionStatus = feature.get('missionStatus') as MissionStatusEnum
  const missionTypes = feature.get('missionTypes') as MissionTypeEnum[]

  const missionTypeLabel = missionTypes?.length > 1 ? 'MULTI' : missionTypes[0]

  switch (missionStatus) {
    case MissionStatusEnum.UPCOMING:
      return missionWithCentroidStyleFactory(MissionStatusEnum.UPCOMING, missionTypeLabel)
    case MissionStatusEnum.PENDING:
      return missionWithCentroidStyleFactory(MissionStatusEnum.PENDING, missionTypeLabel)
    case MissionStatusEnum.ENDED:
      return missionWithCentroidStyleFactory(MissionStatusEnum.ENDED, missionTypeLabel)
    case MissionStatusEnum.CLOSED:
      return missionWithCentroidStyleFactory(MissionStatusEnum.CLOSED, missionTypeLabel)
    default:
      return missionWithCentroidStyleFactory(MissionStatusEnum.CLOSED, missionTypeLabel)
  }
}

export const selectedMissionControlWithCircleStyle = feature => [
  new Style({
    geometry: () => {
      const extent = feature.getGeometry()?.getExtent()
      if (!extent) {
        throw new Error('`extent` is undefined.')
      }

      const center = getCenter(extent)

      return new Point(center)
    },

    image: new Icon({
      displacement: [0, 14],
      scale: 1.1,
      src: 'Control.svg'
    })
  })
]

export const selectedMissionActionsStyle = feature => [
  new Style({
    fill: new Fill({
      color: 'rgba(86, 151, 210, .35)' // Blue Gray
    }),
    image: new Icon({
      displacement: [0, 14],
      scale: 1.1,
      src: 'Control.svg'
    }),
    stroke:
      feature.get('actionType') === ActionTypeEnum.CONTROL && feature.get('isGeometryComputedFromControls')
        ? new Stroke({
            color: THEME.color.charcoal,
            lineCap: 'square',
            lineDash: [2, 8],
            width: 4
          })
        : new Stroke({
            color: THEME.color.charcoal,
            width: 2
          })
  }),
  new Style({
    geometry: () => {
      if (feature.get('actionType') !== ActionTypeEnum.CONTROL) {
        return undefined
      }

      if (!feature.get('isGeometryComputedFromControls')) {
        return feature.getGeometry()
      }

      const extent = feature.getGeometry()?.getExtent()
      if (!extent) {
        throw new Error('`extent` is undefined.')
      }

      const center = getCenter(extent)

      return new Point(center)
    },
    image: new Icon({
      color: THEME.color.charcoal,
      scale: 0.6,
      src: 'Close.svg'
    })
  }),
  new Style({
    geometry: () => {
      if (feature.get('actionType') === ActionTypeEnum.SURVEILLANCE) {
        const geom = feature?.getGeometry() as MultiPolygon
        const polygons = geom?.getPolygons()
        const points = polygons?.map(p => getCenter(p.getExtent()))

        return points && new MultiPoint(points)
      }

      return undefined
    },
    image: new Icon({
      scale: 1.1,
      src: 'Observation.svg'
    })
  }),
  new Style({
    geometry: () => {
      if (feature.get('actionType') !== ActionTypeEnum.CONTROL) {
        return undefined
      }

      if (feature.get('actionType') === ActionTypeEnum.CONTROL && !feature.get('isGeometryComputedFromControls')) {
        return undefined
      }

      return undefined
    },
    image: new Icon({
      displacement: [0, 14],
      scale: 1.1,
      src: 'Control.svg'
    }),
    stroke: new Stroke({
      color: THEME.color.charcoal,
      lineCap: 'square',
      lineDash: [2, 8],
      width: 4
    })
  })
]

export const selectedMissionZoneStyle = new Style({
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

const missionToReportingsLinkStyle = feature => {
  if (!feature.get('attachedReportings') || feature.get('attachedReportings').length === 0) {
    return [new Style({})]
  }
  const missionExtent = feature?.getGeometry()?.getExtent()
  const missionCenter = missionExtent && getCenter(missionExtent)

  return feature.get('attachedReportings').map(
    reporting =>
      new Style({
        geometry: () => {
          const reportingGeom = reporting?.geom
          const geoJSON = new GeoJSON()
          const formattedReportingGeometry = geoJSON.readGeometry(reportingGeom, {
            dataProjection: WSG84_PROJECTION,
            featureProjection: OPENLAYERS_PROJECTION
          })

          const reportingExtent = formattedReportingGeometry?.getExtent()
          const reportingCenter = reportingExtent && getCenter(reportingExtent)

          return new LineString([reportingCenter, missionCenter])
        },
        stroke: new Stroke({
          color: THEME.color.charcoal,
          width: 1
        })
      })
  )
}

const missionCircleStyle = feature => {
  if (!feature.get('attachedReportings') || feature.get('attachedReportings').length === 0) {
    return new Style({})
  }

  return new Style({
    geometry: () => {
      const extent = feature?.getGeometry()?.getExtent()
      const center = extent && getCenter(extent)

      return center && new Point(center)
    },
    image: new Circle({
      displacement: [0, 14],
      radius: 20,
      stroke: new Stroke({
        color: THEME.color.charcoal,
        width: 2
      })
    })
  })
}

export const selectedMissionStyle = feature => [
  selectedMissionZoneStyle,
  missionWithCentroidStyleFn(feature),
  ...missionToReportingsLinkStyle(feature),
  missionCircleStyle(feature)
]
