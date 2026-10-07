import { THEME } from '@mtes-mct/monitor-ui'
import { Fill, Stroke, Style } from 'ol/style'

import { Layers } from '../../../../domain/entities/layers/constants'
import { getColorWithAlpha, stringToColorInGroup } from '../../../../utils/utils'

import type { IsolatedLayerType } from '../../../../domain/shared_slices/Map'
import type { FeatureLike } from 'ol/Feature'

const getStyle = (
  color: string,
  metadataIsShowed: boolean | undefined,
  asMinimap: boolean,
  isFilled: boolean = true
) => {
  const strokeColor = () => {
    if (asMinimap) {
      return getColorWithAlpha(THEME.color.charcoal, 1)
    }

    return metadataIsShowed ? getColorWithAlpha('#FFFF0F', 1) : getColorWithAlpha(THEME.color.darkGoldenrod, 1)
  }

  return new Style({
    fill: new Fill({
      color: isFilled ? getColorWithAlpha(color, 0.7) : 'transparent'
    }),
    stroke: new Stroke({
      color: strokeColor(),
      width: metadataIsShowed || asMinimap ? 3 : 1
    })
  })
}

export const getAMPColorWithAlpha = (type: string | null = '', name: string | null = '', isDisabled = false) => {
  if (isDisabled) {
    return THEME.color.white
  }

  return getColorWithAlpha(stringToColorInGroup(`${type}`, `${name}`, Layers.AMP.code), 0.6)
}

export const getAMPLayerStyle = (
  feature: FeatureLike,
  isolatedLayer?: IsolatedLayerType,
  metadataId?: string | number | undefined
) => {
  const metadataIsShowed = feature.get('metadataIsShowed') || feature.get('id') === metadataId
  const isolatedLayerTypeIsAmp = isolatedLayer?.type?.includes('AMP') ?? false
  const isLayerFilled = isolatedLayer
    ? isolatedLayerTypeIsAmp && isolatedLayer?.id === feature.get('id') && isolatedLayer?.isFilled
    : true
  const colorWithAlpha = getAMPColorWithAlpha(feature.get('designation'), feature.get('name'))

  return getStyle(colorWithAlpha, metadataIsShowed, feature.get('asMinimap'), isLayerFilled)
}
