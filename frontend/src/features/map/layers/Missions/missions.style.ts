import { OPENLAYERS_PROJECTION, THEME, WSG84_PROJECTION } from '@mtes-mct/monitor-ui'
import { getCenter } from 'ol/extent'
import { GeoJSON } from 'ol/format'
import { LineString, MultiPoint, MultiPolygon } from 'ol/geom'
import Point from 'ol/geom/Point'
import { Circle, Icon, Style } from 'ol/style'
import Fill from 'ol/style/Fill'
import Stroke from 'ol/style/Stroke'

import { ActionTypeEnum, MissionStatusEnum } from '../../../../domain/entities/missions'

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

const missionWithCentroidStyleFactory = color =>
  new Style({
    geometry: feature => {
      const extent = feature?.getGeometry()?.getExtent()
      const center = extent && getCenter(extent)

      return center && new Point(center)
    },
    image: new Icon({
      color,
      src: 'marker-flag.svg'
    })
  })

export const missionWithCentroidStyleFn = feature => {
  const missionStatus = feature.get('missionStatus')
  switch (missionStatus) {
    case MissionStatusEnum.UPCOMING:
      return missionWithCentroidStyleFactory(THEME.color.yellowGreen)
    case MissionStatusEnum.PENDING:
      return missionWithCentroidStyleFactory(THEME.color.mediumSeaGreen)
    case MissionStatusEnum.ENDED:
      return missionWithCentroidStyleFactory(THEME.color.charcoal)
    case MissionStatusEnum.CLOSED:
      return missionWithCentroidStyleFactory(THEME.color.opal)
    default:
      return missionWithCentroidStyleFactory(THEME.color.opal)
  }
}

export const selectedMissionActionsStyle = [
  new Style({
    fill: new Fill({
      color: 'rgba(86, 151, 210, .35)' // Blue Gray
    }),
    image: new Icon({
      displacement: [0, 14],
      scale: 1.1,
      src: 'Control.svg'
    }),
    stroke: new Stroke({
      color: THEME.color.charcoal,
      width: 2
    })
  }),
  new Style({
    geometry: feature => {
      if (feature.get('actionType') === ActionTypeEnum.CONTROL) {
        return feature.getGeometry()
      }

      return undefined
    },
    image: new Icon({
      color: THEME.color.charcoal,
      scale: 0.6,
      src: 'Close.svg'
    })
  }),
  new Style({
    geometry: feature => {
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
