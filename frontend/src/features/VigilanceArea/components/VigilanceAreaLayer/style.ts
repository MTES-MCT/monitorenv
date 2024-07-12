import { THEME } from '@mtes-mct/monitor-ui'
import { Fill, Stroke, Style } from 'ol/style'

import { Layers } from '../../../../domain/entities/layers/constants'
import { getColorWithAlpha, stringToColorInGroup } from '../../../../utils/utils'

const getStyle = (color: string, isSelected: boolean | undefined) =>
  new Style({
    fill: new Fill({
      color: getColorWithAlpha(color, 0.7)
    }),
    stroke: new Stroke({
      color: getColorWithAlpha(THEME.color.rufous, 1),
      width: isSelected ? 3 : 1
    })
  })

export const getVigilanceAreaColorWithAlpha = (name: string | null = '', comments: string | null = '') =>
  getColorWithAlpha(stringToColorInGroup(`${name}`, `${comments}`, Layers.VIGILANCE_AREA.code), 0.6)

export const getVigilanceAreaLayerStyle = feature => {
  const colorWithAlpha = getVigilanceAreaColorWithAlpha(feature.get('name'), feature.get('comments'))

  const style = getStyle(colorWithAlpha, feature.get('isSelected'))

  return style
}
