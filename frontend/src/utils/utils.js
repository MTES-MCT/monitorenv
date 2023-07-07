/* eslint-disable no-bitwise */

import { THEME } from '@mtes-mct/monitor-ui'
import { asArray, asString } from 'ol/color'

import { Layers } from '../domain/entities/layers/constants'

/**
 *
 * @param {string} hexColor
 * @param {number[]} defaultColor
 * @returns
 */
export const customHexToRGB = (hexColor, defaultColor) => {
  if (!hexColor || !(typeof hexColor === 'string')) {
    return defaultColor || [0, 0, 0]
  }
  const aRgbHex = hexColor.substring(1).match(/.{1,2}/g)
  const aRgb = [parseInt(aRgbHex[0], 16), parseInt(aRgbHex[1], 16), parseInt(aRgbHex[2], 16)]

  return aRgb
}

export const regulatoryColorsBlues = [
  THEME.color.yaleBlue,
  THEME.color.glaucous,
  THEME.color.blueNcs,
  THEME.color.iceberg,
  THEME.color.lightSteelBlue,
  THEME.color.lightPeriwinkle
]
export const regulatoryColorsGreens = [
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

export const ampColors = [
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
export function stringToArrayItem(str, arr) {
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

export function stringToColorInGroup(group, name, layerType) {
  const colors = layerType === Layers.AMP.code ? [ampColors] : [regulatoryColorsBlues, regulatoryColorsGreens]
  const colorSet = stringToArrayItem(group, colors)

  return stringToArrayItem(name, colorSet)
}

export const calculatePointsDistance = (coord1, coord2) => {
  const dx = coord1[0] - coord2[0]
  const dy = coord1[1] - coord2[1]

  return Math.sqrt(dx * dx + dy * dy)
}

export const calculateSplitPointCoords = (startNode, nextNode, distanceBetweenNodes, distanceToSplitPoint) => {
  const d = distanceToSplitPoint / distanceBetweenNodes
  const x = nextNode[0] + (startNode[0] - nextNode[0]) * d
  const y = nextNode[1] + (startNode[1] - nextNode[1]) * d

  return [x, y]
}

export const arraysEqual = (a, b) => {
  if (a === b) {
    return true
  }
  if (a == null || b == null) {
    return false
  }
  if (a.length !== b.length) {
    return false
  }

  // If you don't care about the order of the elements inside
  // the array, you should sort both arrays here.
  // Please note that calling sort on an array will modify that array.
  // you might want to clone your array first.

  for (let i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) {
      return false
    }
  }

  return true
}

export const getTextWidth = text => {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  context.font = 'Normal 12px Arial'
  const metrics = context.measureText(text)

  return metrics.width
}

export const getHash = string => {
  const len = string.length
  let h = 5381

  for (let i = 0; i < len; i++) {
    h = (h * 33) ^ string.charCodeAt(i)
  }

  return h >>> 0
}

export const getColorWithAlpha = (color, alpha) => {
  const [r, g, b] = Array.from(asArray(color))

  return asString([r, g, b, alpha])
}

const accentsMap = {
  a: 'á|à|ã|â|À|Á|Ã|Â',
  c: 'ç|Ç',
  e: 'é|è|ê|É|È|Ê',
  i: 'í|ì|î|Í|Ì|Î',
  n: 'ñ|Ñ',
  o: 'ó|ò|ô|õ|Ó|Ò|Ô|Õ',
  u: 'ú|ù|û|ü|Ú|Ù|Û|Ü'
}

export const removeAccents = text =>
  Object.keys(accentsMap).reduce((acc, cur) => acc.toString().replace(new RegExp(accentsMap[cur], 'g'), cur), text)

export function getTextForSearch(text) {
  if (!text) {
    return ''
  }

  return removeAccents(text)
    .toLowerCase()
    .replace(/[ ]/g, '')
    .replace(/[_]/g, '')
    .replace(/[-]/g, '')
    .replace(/[']/g, '')
    .replace(/["]/g, '')
}

export function getNauticalMilesFromMeters(length) {
  return Math.round((length / 1000) * 100 * 0.539957) / 100
}
