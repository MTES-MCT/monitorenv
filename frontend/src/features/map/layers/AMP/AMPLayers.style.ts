import { THEME } from '@mtes-mct/monitor-ui'
import { Fill, Stroke, Style } from 'ol/style'

import { Layers } from '../../../../domain/entities/layers/constants'
import { getColorWithAlpha, stringToColorInGroup } from '../../../../utils/utils'

const getStyle = (color: string, metadataIsShowed: boolean | undefined, isFilled: boolean = true) =>
  new Style({
    fill: new Fill({
      color: isFilled ? getColorWithAlpha(color, 0.7) : 'transparent'
    }),
    stroke: new Stroke({
      color: metadataIsShowed ? getColorWithAlpha('#FFFF0F', 1) : getColorWithAlpha(THEME.color.darkGoldenrod, 1),
      width: metadataIsShowed ? 3 : 1
    })
  })

export const getAMPColorWithAlpha = (type: string | null = '', name: string | null = '', isDisabled = false) => {
  if (isDisabled) {
    return THEME.color.white
  }

  return getColorWithAlpha(stringToColorInGroup(`${type}`, `${name}`, Layers.AMP.code), 0.6)
}

export const getAMPLayerStyle = feature => {
  const colorWithAlpha = getAMPColorWithAlpha(feature.get('designation'), feature.get('name'))

  return getStyle(colorWithAlpha, feature.get('metadataIsShowed'), feature.get('isFilled'))
}
