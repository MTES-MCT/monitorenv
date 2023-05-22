import { LineString, Point } from 'ol/geom'
import { Icon, Stroke, Style } from 'ol/style'

import { COLORS } from '../../../../constants/constants'

const lineStyle = new Style({
  geometry: feature => {
    const overlayPostion = feature.get('overlayPosition')

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

const semaphoreStyle = new Style({
  image: new Icon({
    src: 'semaphore.svg'
  })
})

export const semaphoreStyles = [lineStyle, semaphoreStyle]
