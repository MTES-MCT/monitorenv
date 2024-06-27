import { THEME } from '@mtes-mct/monitor-ui'
import { Fill, Stroke, Style } from 'ol/style'

import { Layers } from '../../../../domain/entities/layers/constants'
import { getColorWithAlpha, stringToColorInGroup } from '../../../../utils/utils'

const getStyle = (color: string, metadataIsShowed: boolean | undefined) =>
  new Style({
    fill: new Fill({
      color: getColorWithAlpha(color, 0.7)
    }),
    stroke: new Stroke({
      color: getColorWithAlpha(THEME.color.chineseRed, 1),
      lineDash: [4, 4],
      width: metadataIsShowed ? 3 : 1
    })
  })

export const getVigilanceAreaColorWithAlpha = (type: string | null = '', comments: string | null = '') =>
  getColorWithAlpha(stringToColorInGroup(`${type}`, `${comments}`, Layers.VIGILANCE_AREA.code), 0.6)

export const getVigilanceAreaLayerStyle = feature => {
  const colorWithAlpha = getVigilanceAreaColorWithAlpha(feature.get('designation'), feature.get('comments'))

  const style = getStyle(colorWithAlpha, feature.get('metadataIsShowed'))

  return style
}
