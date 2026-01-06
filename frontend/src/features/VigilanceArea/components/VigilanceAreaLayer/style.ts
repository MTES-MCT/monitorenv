import { isWithinPeriod } from '@features/VigilanceArea/components/VigilanceAreaForm/utils'
import { VigilanceArea } from '@features/VigilanceArea/types'
import { THEME } from '@mtes-mct/monitor-ui'
import { getColorWithAlpha, stringToColorInGroup } from '@utils/utils'
import { Fill, Stroke, Style } from 'ol/style'

import { Layers } from '../../../../domain/entities/layers/constants'

const getStyle = (
  color: string,
  isSelected: boolean | undefined,
  asMinimap: boolean,
  isFilled: boolean = true,
  isWithinCriticalPeriod: boolean = false
) => {
  const strokeColor = () => {
    if (asMinimap) {
      return getColorWithAlpha(THEME.color.charcoal, 1)
    }
    if (isWithinCriticalPeriod) {
      return getColorWithAlpha(THEME.color.maximumRed, 1)
    }

    return isSelected ? getColorWithAlpha('#FF4433', 1) : getColorWithAlpha(THEME.color.rufous, 1)
  }

  return new Style({
    fill: new Fill({
      color: isFilled ? getColorWithAlpha(color, 0.5) : 'transparent'
    }),
    stroke: new Stroke({
      color: strokeColor(),
      width: isSelected || asMinimap || isWithinCriticalPeriod ? 3 : 1
    })
  })
}

export const getVigilanceAreaColorWithAlpha = (
  name: string | null = '',
  comments: string | null = '',
  withoutPeriod = false
) => {
  if (withoutPeriod) {
    return THEME.color.white
  }

  return getColorWithAlpha(stringToColorInGroup(`${name}`, `${comments}`, Layers.VIGILANCE_AREA.code), 0.5)
}

export const getVigilanceAreaLayerStyle = feature => {
  const periods = feature.get('periods') as Array<VigilanceArea.VigilanceAreaPeriod> | undefined
  const isWithinCriticalPeriod = isWithinPeriod(periods, true)

  const colorWithAlpha = getVigilanceAreaColorWithAlpha(
    feature.get('name'),
    feature.get('comments'),
    periods?.length === 0
  )

  return getStyle(
    colorWithAlpha,
    feature.get('isSelected'),
    feature.get('asMinimap'),
    feature.get('isFilled'),
    isWithinCriticalPeriod
  )
}
