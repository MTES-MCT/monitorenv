import { THEME } from '@mtes-mct/monitor-ui'
import { Fill, Stroke, Style } from 'ol/style'

import { Layers } from '../../../../domain/entities/layers/constants'
import { getColorWithAlpha, stringToColorInGroup } from '../../../../utils/utils'

const getStyle = (color: string, isSelected: boolean | undefined) =>
  new Style({
    fill: new Fill({
      color: getColorWithAlpha(color, 0.5)
    }),
    stroke: new Stroke({
      color: getColorWithAlpha(THEME.color.rufous, 1),
      width: isSelected ? 3 : 1
    })
  })

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

  const style = getStyle(colorWithAlpha, feature.get('isSelected'))

  return style
}
