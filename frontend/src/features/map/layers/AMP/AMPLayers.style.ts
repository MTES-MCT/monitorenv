import { Fill, Stroke, Style } from 'ol/style'

import { Layers } from '../../../../domain/entities/layers/constants'
import { getColorWithAlpha, stringToColorInGroup } from '../../../../utils/utils'

const getStyle = (color: string, metadataIsShowed: boolean | undefined) =>
  new Style({
    fill: new Fill({
      color: getColorWithAlpha(color, 0.7)
    }),
    stroke: new Stroke({
      color: getColorWithAlpha('#A98A0F', 1), // TODO: eplace with the color in Monitor-ui when it is created
      width: metadataIsShowed ? 3 : 1
    })
  })

export const getAMPColorWithAlpha = (type: string | null = '', name: string | null = '') =>
  getColorWithAlpha(stringToColorInGroup(`${type}`, `${name}`, Layers.AMP.code), 0.6)

export const getAMPLayerStyle = feature => {
  const colorWithAlpha = getAMPColorWithAlpha(feature.get('designation'), feature.get('name'))

  const style = getStyle(colorWithAlpha, feature.get('metadataIsShowed'))

  return style
}
