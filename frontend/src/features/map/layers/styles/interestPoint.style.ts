import { THEME } from '@mtes-mct/monitor-ui'
import { Icon, Style } from 'ol/style'
import CircleStyle from 'ol/style/Circle'
import Fill from 'ol/style/Fill'
import Stroke from 'ol/style/Stroke'

import {
  INTEREST_POINT_STYLE_ICON_FILENAME,
  INTEREST_POINT_STYLE_ZINDEX
} from '../../../../domain/entities/interestPoints'

export const getIconStyle = (resolution: number) =>
  new Style({
    image: new Icon({
      displacement: [0, 10],
      scale: 1 / resolution ** (1 / 8) + 0.3,
      src: INTEREST_POINT_STYLE_ICON_FILENAME
    }),
    zIndex: INTEREST_POINT_STYLE_ZINDEX
  })

export const getStrokeStyles = () => [
  new Style({
    stroke: new Stroke({
      color: THEME.color.slateGray,
      lineDash: [4, 4],
      width: 2
    })
  })
]

export const getInterestPointStyle = (shouldStyleStroke: boolean | undefined, resolution: number) => {
  if (shouldStyleStroke) {
    return getStrokeStyles()
  }

  return getIconStyle(resolution)
}

export const POIStyle = new Style({
  image: new CircleStyle({
    fill: new Fill({
      color: THEME.color.slateGray
    }),
    radius: 2,
    stroke: new Stroke({
      color: THEME.color.slateGray
    })
  }),
  stroke: new Stroke({
    color: THEME.color.slateGray,
    lineDash: [4, 4],
    width: 2
  })
})
