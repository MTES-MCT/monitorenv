import { THEME } from '@mtes-mct/monitor-ui'
import { getCenter } from 'ol/extent'
import { Point } from 'ol/geom'
import { Icon, Style } from 'ol/style'

export const recentControlActivityStyle = () =>
  new Style({
    geometry: feature => {
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
  })
