import { THEME } from '@mtes-mct/monitor-ui'
import { Fill, Stroke, Style } from 'ol/style'

import { Layers } from '../../../../domain/entities/layers/constants'
import { getColorWithAlpha, stringToColorInGroup } from '../../../../utils/utils'

const getStyle = (color: string, isSelected: boolean | undefined, asMinimap: boolean, isFilled: boolean = true) => {
  const strokeColor = () => {
    if (asMinimap) {
      return getColorWithAlpha(THEME.color.charcoal, 1)
    }

    return isSelected ? getColorWithAlpha('#FF4433', 1) : getColorWithAlpha(THEME.color.rufous, 1)
  }

  return new Style({
    fill: new Fill({
      color: isFilled ? getColorWithAlpha(color, 0.5) : 'transparent'
    }),
    stroke: new Stroke({
      color: strokeColor(),
      width: isSelected || asMinimap ? 3 : 1
    })
  })
}

export const getVigilanceAreaColorWithAlpha = (
  name: string | null = '',
  comments: string | null = '',
  isArchived = false
) => {
  if (isArchived) {
    return THEME.color.white
  }

  return getColorWithAlpha(stringToColorInGroup(`${name}`, `${comments}`, Layers.VIGILANCE_AREA.code), 0.5)
}

export const getVigilanceAreaLayerStyle = feature => {
  const isArchived = feature.get('isArchived')

  const colorWithAlpha = getVigilanceAreaColorWithAlpha(feature.get('name'), feature.get('comments'), isArchived)

  return getStyle(colorWithAlpha, feature.get('isSelected'), feature.get('asMinimap'), feature.get('isFilled'))
}
