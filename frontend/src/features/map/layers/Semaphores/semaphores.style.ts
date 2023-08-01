/* import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '@mtes-mct/monitor-ui'
import { isEmpty } from 'lodash'
import { getCenter } from 'ol/extent'
import { GeoJSON } from 'ol/format' */
import { LineString, /* MultiLineString, */ Point } from 'ol/geom'
import { Icon, Stroke, Style } from 'ol/style'

import { COLORS } from '../../../../constants/constants'

const lineStyle = new Style({
  geometry: feature => {
    const overlayPostion = feature.get('overlayCoordinates')
    if (!overlayPostion) {
      return undefined
    }
    const featureGeometry = (feature?.getGeometry() as Point)?.getCoordinates()

    return new LineString([overlayPostion, featureGeometry])
  },
  stroke: new Stroke({
    color: COLORS.slateGray,
    lineDash: [4, 4],
    width: 2
  })
})

/* const reportingLinkStyle = new Style({
  geometry: feature => {
    const semaphoreGeometry = (feature?.getGeometry() as Point)?.getCoordinates()
    const reportingsGeometries = feature?.get('reportings')?.reduce((lines, reporting) => {
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
    color: COLORS.slateGray,
    width: 1
  })
}) */

const semaphoreStyle = new Style({
  image: new Icon({
    src: 'semaphore.svg'
  })
})

export const semaphoreStyles = [lineStyle, semaphoreStyle]
