import { THEME } from '@mtes-mct/monitor-ui'
import { Fill, Stroke, Style } from 'ol/style'

import { Layers } from '../../../../domain/entities/layers/constants'
import { getColorWithAlpha, stringToColorInGroup } from '../../../../utils/utils'

const getStyle = (color, metadataIsShowed) =>
  new Style({
    fill: new Fill({
      color: getColorWithAlpha(color, 0.7)
    }),
    stroke: new Stroke({
      color: getColorWithAlpha(THEME.color.chineseRed, 1),
      width: metadataIsShowed ? 3 : 1
    })
  })

/**
 *
 * @param {string} group
 * @param {string} layername
 * @returns
 */
export const getAMPColorWithAlpha = (group = '', layername = '') =>
  getColorWithAlpha(stringToColorInGroup(`${group}`, `${layername}`, Layers.AMP.code), 0.6)

export const getAMPLayerStyle = feature => {
  const colorWithAlpha = getAMPColorWithAlpha(feature.get('designation'), feature.get('name'))

  const style = getStyle(colorWithAlpha, false)

  return style
}
