import { overlayStroke } from '@features/map/overlays/style'
import { OPENLAYERS_PROJECTION, THEME, WSG84_PROJECTION } from '@mtes-mct/monitor-ui'
import { MissionStatusEnum, MissionTypeEnum } from 'domain/entities/missions'
import { getCenter } from 'ol/extent'
import { GeoJSON } from 'ol/format'
import { LineString, MultiPoint, MultiPolygon } from 'ol/geom'
import Point from 'ol/geom/Point'
import { Circle, Icon, Style } from 'ol/style'
import Fill from 'ol/style/Fill'
import Stroke from 'ol/style/Stroke'

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

const missionIconStyle = (status, type, zIndex) => [
  new Style({
    geometry: feature => {
      const extent = feature?.getGeometry()?.getExtent()
      const center = extent && getCenter(extent)

      return center && new Point(center)
    },
    image: new Icon({
      displacement: [0, 20],
      scale: 0.5,
      src: `mission/${status}_${type}.png`
    }),
    zIndex
  })
]

export const missionStyleFn = feature => {
  const missionStatus = feature.get('missionStatus') as MissionStatusEnum
  const missionTypes = feature.get('missionTypes') as MissionTypeEnum[]

  const missionTypeLabel = missionTypes?.length > 1 ? 'MULTI' : missionTypes[0]

  switch (missionStatus) {
    case MissionStatusEnum.UPCOMING:
      return missionIconStyle(MissionStatusEnum.UPCOMING, missionTypeLabel, 4)
    case MissionStatusEnum.PENDING:
      return missionIconStyle(MissionStatusEnum.PENDING, missionTypeLabel, 3)
    case MissionStatusEnum.ENDED:
      return missionIconStyle(MissionStatusEnum.ENDED, missionTypeLabel, 2)
    default:
      return missionIconStyle(MissionStatusEnum.ENDED, missionTypeLabel, 2)
  }
}

export const selectedMissionControlStyle = (feature, missionGeom, isEditingSurveillanceZoneOrControlPoint) => [
  // Close icon for controls
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
      color: THEME.color.charcoal,
      scale: 0.6,
      src: 'Close.svg'
    })
  }),
  // Control icon with infraction
  new Style({
    geometry: () => {
      const controlHasInfraction = feature.get('infractions').length > 0
      if (!controlHasInfraction) {
        return undefined
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
      displacement: [0, 18],
      scale: 1.1,
      src: 'Control_filled.svg'
    })
  }),
  // Control icon without infraction
  new Style({
    geometry: () => {
      const controlHasInfraction = feature.get('infractions') && feature.get('infractions').length > 0
      if (controlHasInfraction) {
        return undefined
      }

      const extent = feature.getGeometry()?.getExtent()
      if (!extent) {
        throw new Error('`extent` is undefined.')
      }

      const center = getCenter(extent)

      return new Point(center)
    },
    image: new Icon({
      displacement: [0, 16],
      scale: 1.1,
      src: 'Control.svg'
    })
  }),
  // Control zone or point
  new Style({
    fill: new Fill({
      color: 'rgba(86, 151, 210, .2)' // Blue Gray
    }),
    geometry: () => {
      const extent = feature.getGeometry()?.getExtent()
      if (!extent) {
        throw new Error('`extent` is undefined.')
      }

      const center = getCenter(extent)

      return new Point(center)
    },
    stroke: new Stroke({
      color: THEME.color.charcoal,
      lineCap: 'square',
      lineDash: [2, 8],
      width: 4
    })
  }),
  new Style({
    geometry: () => {
      if (isEditingSurveillanceZoneOrControlPoint) {
        return undefined
      }
      const extent = feature.getGeometry()?.getExtent()
      const controlCenter = extent && getCenter(extent)

      const geoJSON = new GeoJSON()
      const formattedMissionGeometry = geoJSON.readGeometry(missionGeom, {
        dataProjection: WSG84_PROJECTION,
        featureProjection: OPENLAYERS_PROJECTION
      })

      const missionExtent = formattedMissionGeometry?.getExtent()
      const missionCenter = missionExtent && getCenter(missionExtent)

      if (!missionCenter || !controlCenter) {
        return undefined
      }

      return new LineString([missionCenter, controlCenter])
    },
    stroke: new Stroke({
      color: THEME.color.charcoal,
      width: 1
    })
  })
]

export const selectedMissionSurveillanceStyle = [
  // Surveillance icon
  new Style({
    geometry: feature => {
      const geom = feature?.getGeometry() as MultiPolygon
      const polygons = geom?.getPolygons()
      const points = polygons?.map(p => getCenter(p.getExtent()))

      if (!points) {
        return undefined
      }

      return new MultiPoint(points)
    },
    image: new Icon({
      scale: 1.1,
      src: 'Observation.svg'
    })
  }),
  // Surveillance zone
  new Style({
    fill: new Fill({
      color: 'rgba(86, 151, 210, .2)' // Blue Gray
    }),
    stroke: new Stroke({
      color: THEME.color.charcoal,
      width: 2
    }),
    zIndex: 3
  })
]

export const selectedMissionZoneStyle = [
  new Style({
    fill: new Fill({
      color: 'rgba(86, 151, 210, .2)' // Blue Gray
    }),
    stroke: new Stroke({
      color: THEME.color.charcoal,
      lineCap: 'square',
      lineDash: [2, 8],
      width: 4
    })
  }),
  overlayStroke
]

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

const missionCircleStyle = new Style({
  geometry: feature => {
    if (!feature.get('attachedReportings') || feature.get('attachedReportings').length === 0) {
      return undefined
    }
    const extent = feature?.getGeometry()?.getExtent()
    const center = extent && getCenter(extent)

    return center && new Point(center)
  },
  image: new Circle({
    displacement: [0, 23],
    radius: 20,
    stroke: new Stroke({
      color: THEME.color.charcoal,
      width: 2
    })
  })
})

export const selectedMissionStyle = feature => [
  ...selectedMissionZoneStyle,
  ...missionStyleFn(feature),
  ...missionToReportingsLinkStyle(feature),
  missionCircleStyle
]
