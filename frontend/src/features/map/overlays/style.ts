import { THEME } from '@mtes-mct/monitor-ui'
import { isEmpty } from 'lodash-es'
import { getCenter } from 'ol/extent'
import { LineString } from 'ol/geom'
import { Style, Stroke } from 'ol/style'

export const overlayStroke = new Style({
  geometry: feature => {
    const overlayPosition = feature.get('overlayCoordinates')
    if (isEmpty(overlayPosition)) {
      return undefined
    }

    const extent = feature?.getGeometry()?.getExtent()
    const center = extent && getCenter(extent)
    if (!center) {
      return undefined
    }

    return new LineString([overlayPosition.coordinates, center])
  },
  stroke: new Stroke({
    color: THEME.color.slateGray,
    lineDash: [4, 4],
    width: 2
  })
})
