import { Fill, Stroke, Style } from 'ol/style'

import { COLORS } from '../../../../constants/constants'
import { getColorWithAlpha, stringToColorInGroup } from '../../../../utils/utils'

const getStyle = (color, metadataIsShowed) =>
  new Style({
    fill: new Fill({
      color
    }),
    stroke: new Stroke({
      color: getColorWithAlpha(COLORS.chineseRed, 0.7),
      width: metadataIsShowed ? 3 : 1
    })
  })

/**
 *
 * @param {string} group
 * @param {string} layername
 * @returns
 */
const getAMPColorWithAlpha = (group = '', layername = '') =>
  getColorWithAlpha(stringToColorInGroup(`${group}`, `${layername}`), 0.6)

export const getAMPLayerStyle = feature => {
  const colorWithAlpha = getAMPColorWithAlpha(feature.get('designation'), feature.get('name'))

  const style = getStyle(colorWithAlpha, false)

  return style
}
