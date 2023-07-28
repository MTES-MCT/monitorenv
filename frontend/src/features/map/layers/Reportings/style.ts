import { THEME } from '@mtes-mct/monitor-ui'
import { getCenter } from 'ol/extent'
import { LineString, Point } from 'ol/geom'
import { Icon, Stroke, Style } from 'ol/style'

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
    color: THEME.color.slateGray,
    lineDash: [4, 4],
    width: 2
  })
})

const reportingStyle = new Style({
  geometry: feature => {
    const extent = feature?.getGeometry()?.getExtent()
    const center = extent && getCenter(extent)

    return center && new Point(center)
  },
  image: new Icon({
    color: THEME.color.charcoal,
    src: 'report.svg'
  })
})

export const reportingStyles = [lineStyle, reportingStyle]
