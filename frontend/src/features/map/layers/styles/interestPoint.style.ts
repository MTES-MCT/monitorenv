import { THEME } from '@mtes-mct/monitor-ui'
import { Icon, Style } from 'ol/style'
import CircleStyle from 'ol/style/Circle'
import Fill from 'ol/style/Fill'
import Stroke from 'ol/style/Stroke'

import { INTEREST_POINT_STYLE } from '../../../../domain/entities/interestPoints'

const lineStyle = new Style({
  stroke: new Stroke({
    color: THEME.color.slateGray,
    lineDash: [4, 4],
    width: 2
  })
})

export const getInterestPointStyle = (feature, resolution) => {
  if (feature?.getId()?.toString()?.includes('line')) {
    return [lineStyle]
  }

  const style = new Style({
    image: new Icon({
      offset: [0, 0],
      size: [30, 79],
      src: 'Point_interet_feature_autre.png'
    }),
    zIndex: INTEREST_POINT_STYLE
  })

  style.getImage()?.setScale(1 / resolution ** (1 / 8) + 0.3)

  return style
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
