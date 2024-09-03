import { THEME } from '@mtes-mct/monitor-ui'
import { isEmpty } from 'lodash'
import { getCenter } from 'ol/extent'
import { LineString } from 'ol/geom'
import { Icon, Stroke, Style } from 'ol/style'

export const layerListIconStyle = (feature, resolution) => [
  new Style({
    geometry: () => {
      const overlayPostion = feature.get('overlayCoordinates')

      if (isEmpty(overlayPostion)) {
        return undefined
      }

      const extent = feature?.getGeometry()?.getExtent()
      const center = extent && getCenter(extent)
      if (!center) {
        return undefined
      }

      return new LineString([overlayPostion.coordinates, center])
    },
    stroke: new Stroke({
      color: THEME.color.slateGray,
      lineDash: [4, 4],
      width: 2
    })
  }),
  new Style({ image: new Icon({ scale: 1 / resolution ** (1 / 8) + 0.4, src: 'Cursor_border.svg' }) })
]
