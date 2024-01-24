/* eslint-disable no-bitwise, no-plusplus */

import { THEME } from '@mtes-mct/monitor-ui'
import { asArray, asString } from 'ol/color'

import { Layers } from '../domain/entities/layers/constants'

const regulatoryColorsBlues = [
  THEME.color.yaleBlue,
  THEME.color.glaucous,
  THEME.color.blueNcs,
  THEME.color.iceberg,
  THEME.color.lightSteelBlue,
  THEME.color.lightPeriwinkle
]
const regulatoryColorsGreens = [
  THEME.color.aliceBlue,
  THEME.color.lightCyan,
  THEME.color.middleBlueGreen,
  THEME.color.verdigris,
  THEME.color.viridianGreen,
  THEME.color.paoloVeroneseGreen,
  THEME.color.skobeloff,
  THEME.color.blueSapphire,
  THEME.color.indigoDye
]

const ampColors = [
  THEME.color.chineseRed,
  THEME.color.brownSugar,
  THEME.color.rust,
  THEME.color.burntSienna,
  THEME.color.persianOrange,
  THEME.color.jasper,
  THEME.color.bittersweet,
  THEME.color.coral,
  THEME.color.peach,
  THEME.color.apricot,
  THEME.color.melon,
  THEME.color.paleDogwood,
  THEME.color.seashell
]
/**
 * Get a color from palette from string
 * https://gist.github.com/0x263b/2bdd90886c2036a1ad5bcf06d6e6fb37
 */
// TODO Type these params, `arr` is shady (`string | string[] | string[][] | undefined` => ?).
function stringToArrayItem(str: string, arr) {
  let hash = 0
  if (str.length === 0) {
    return arr[hash]
  }
  for (let i = 0; i < str.length; i += 1) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
    hash &= hash
  }
  hash = ((hash % arr.length) + arr.length) % arr.length

  return arr[hash]
}

export function stringToColorInGroup(group: string, name: string, layerType?: string) {
  const colors = layerType === Layers.AMP.code ? [ampColors] : [regulatoryColorsBlues, regulatoryColorsGreens]
  const colorSet = stringToArrayItem(group, colors)

  return stringToArrayItem(name, colorSet)
}

export const getColorWithAlpha = (color, alpha) => {
  const [r, g, b] = Array.from(asArray(color))

  return asString([r, g, b, alpha])
}

export function getNauticalMilesFromMeters(length: number): number {
  return Math.round((length / 1000) * 100 * 0.539957) / 100
}
