import { THEME } from '@mtes-mct/monitor-ui'
import { getCenter } from 'ol/extent'
import Point from 'ol/geom/Point'
import CircleStyle from 'ol/style/Circle'
import Fill from 'ol/style/Fill'
import Stroke from 'ol/style/Stroke'
import Style from 'ol/style/Style'

export const measurementStyleWithCenter = new Style({
  geometry: feature => {
    const extent = feature.getGeometry()?.getExtent()
    if (!extent) {
      throw new Error('`extent` is undefined.')
    }

    const center = getCenter(extent)

    return new Point(center)
  },
  image: new CircleStyle({
    fill: new Fill({
      color: THEME.color.slateGray
    }),
    radius: 2
  })
})

export const measurementStyle = ({ filled = false } = {}) =>
  new Style({
    fill: filled
      ? new Fill({
          color: '#70707033'
        })
      : undefined,
    stroke: new Stroke({
      color: THEME.color.slateGray,
      lineDash: [4, 4],
      width: 2
    })
  })
