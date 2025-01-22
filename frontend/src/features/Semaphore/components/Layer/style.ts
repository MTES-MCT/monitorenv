import { overlayStroke } from '@features/map/overlays/style'
import { OPENLAYERS_PROJECTION, THEME, WSG84_PROJECTION } from '@mtes-mct/monitor-ui'
import { isEmpty } from 'lodash'
import { getCenter } from 'ol/extent'
import { GeoJSON } from 'ol/format'
import { LineString, MultiLineString, Point } from 'ol/geom'
import { Circle, Icon, Stroke, Style } from 'ol/style'

export const reportingLinkStyle = new Style({
  geometry: feature => {
    const semaphoreGeometry = (feature?.getGeometry() as Point)?.getCoordinates()
    const reportingsGeometries = feature?.get('reportingsAttachedToSemaphore')?.reduce((lines, reporting) => {
      if (reporting.geom) {
        const geom = reporting?.geom
        const geoJSON = new GeoJSON()
        const geometry = geoJSON.readGeometry(geom, {
          dataProjection: WSG84_PROJECTION,
          featureProjection: OPENLAYERS_PROJECTION
        })
        const extent = geometry?.getExtent()
        const center = extent && getCenter(extent)
        if (center) {
          lines.push(new LineString([center, semaphoreGeometry]))
        }
      }

      return lines
    }, [] as LineString[])

    if (!isEmpty(reportingsGeometries)) {
      return new MultiLineString(reportingsGeometries)
    }

    return undefined
  },
  stroke: new Stroke({
    color: THEME.color.slateGray,
    width: 1
  })
})
const semaphoreCircleStyle = new Style({
  geometry: feature => {
    if (!feature?.get('reportingsAttachedToSemaphore')) {
      return undefined
    }
    const extent = feature?.getGeometry()?.getExtent()
    const center = extent && getCenter(extent)

    return center && new Point(center)
  },
  image: new Circle({
    radius: 15,
    stroke: new Stroke({
      color: THEME.color.charcoal,
      width: 2
    })
  })
})

export const getSemaphoreStyle = (feature, isSuperUser) => {
  const isSemaphoreHighlighted = feature.get('isHighlighted')
  const semaphoreStyle = new Style({
    image: new Icon({
      src: `icons/semaphore_border${isSemaphoreHighlighted ? '_highlighted' : ''}.svg`
    })
  })

  if (isSuperUser) {
    return [overlayStroke, semaphoreStyle, semaphoreCircleStyle]
  }

  return [overlayStroke, semaphoreStyle]
}

export const getSelectedSemaphoreStyle = (feature, isSuperUser) => [
  ...getSemaphoreStyle(feature, isSuperUser),
  reportingLinkStyle
]
