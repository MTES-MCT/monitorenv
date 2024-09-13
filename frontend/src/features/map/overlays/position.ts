/* eslint-disable sort-keys-fix/sort-keys-fix */
import { containsXY, type Extent } from 'ol/extent'

type Margins = {
  xLeft: number
  xMiddle: number
  xRight: number
  yBottom: number
  yMiddle: number
  yTop: number
}

/**
 *
 * @param {*} boxSize taille de la boite
 * @param {*} x coordonnée x du centre de la boite
 * @param {*} y coordonnée y du centre de la boite
 */
function getOuterExtentPositionForCentroid(boxSize, x, y) {
  return {
    TOP_LEFT: {
      x: x - boxSize,
      y: y + boxSize
    },
    TOP_RIGHT: {
      x: x + boxSize,
      y: y + boxSize
    },
    BOTTOM_LEFT: {
      x: x - boxSize,
      y: y - boxSize
    },
    BOTTOM_RIGHT: {
      x: x + boxSize,
      y: y - boxSize
    },
    TOP: {
      x,
      y: y + boxSize
    },
    RIGHT: {
      x: x + boxSize,
      y
    },
    LEFT: {
      x: x - boxSize,
      y
    },
    BOTTOM: {
      x,
      y: y - boxSize
    }
  }
}

function getOuterExtentPositionForExtent(
  featureExtent: Extent,
  boxSize: {
    height: number
    resolution: number
    width: number
  }
) {
  const [xTop, yTop, xBottom, yBottom] = featureExtent as [number, number, number, number]

  return {
    BOTTOM_LEFT: {
      x: xTop - boxSize.width * boxSize.resolution,
      y: yBottom - boxSize.height * boxSize.resolution
    },
    BOTTOM_RIGHT: {
      x: xBottom + boxSize.width * boxSize.resolution * 2,
      y: yBottom - boxSize.height * boxSize.resolution
    },
    TOP_LEFT: {
      x: xTop - boxSize.width * boxSize.resolution,
      y: yTop + boxSize.height * boxSize.resolution * 2
    },
    TOP_RIGHT: {
      x: xBottom + boxSize.width * boxSize.resolution * 2,
      y: yTop + boxSize.height * boxSize.resolution * 2
    }
  }
}

export enum OverlayPosition {
  BOTTOM = 'BOTTOM',
  BOTTOM_LEFT = 'BOTTOM_LEFT',
  BOTTOM_RIGHT = 'BOTTOM_RIGHT',
  CENTER = 'CENTER',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
  TOP = 'TOP',
  TOP_LEFT = 'TOP_LEFT',
  TOP_RIGHT = 'TOP_RIGHT'
}

/**
 * Get the [top, left] overlay margins to use for overlay placement
 * @param {OverlayPosition} nextOverlayPosition
 * @param {{
    xRight,
    xMiddle,
    xLeft,
    yTop,
    yMiddle,
    yBottom,
  }} margins
 * @returns {number[]} margins - The [top, left] overlay margins (and not the x, y margins)
 */
export function getTopLeftMargin(nextOverlayPosition: OverlayPosition, margins: Margins) {
  const { xLeft, xMiddle, xRight, yBottom, yMiddle, yTop } = margins
  switch (nextOverlayPosition) {
    case OverlayPosition.TOP_LEFT:
      return [yTop, xLeft]
    case OverlayPosition.TOP_RIGHT:
      return [yTop, xRight]
    case OverlayPosition.BOTTOM_LEFT:
      return [yBottom, xLeft]
    case OverlayPosition.BOTTOM_RIGHT:
      return [yBottom, xRight]
    case OverlayPosition.TOP:
      return [yTop, xMiddle]
    case OverlayPosition.RIGHT:
      return [yMiddle, xRight]
    case OverlayPosition.BOTTOM:
      return [yBottom, xMiddle]
    case OverlayPosition.LEFT:
      return [yMiddle, xLeft]
    default:
      return [yBottom, yMiddle]
  }
}

export function getOverlayPositionForCentroid(boxSize, x, y, extent) {
  const position = getOuterExtentPositionForCentroid(boxSize, x, y)
  if (!containsXY(extent, position.TOP.x, position.TOP.y) && !containsXY(extent, position.LEFT.x, position.LEFT.y)) {
    return OverlayPosition.TOP_LEFT
  }
  if (!containsXY(extent, position.TOP.x, position.TOP.y) && !containsXY(extent, position.RIGHT.x, position.RIGHT.y)) {
    return OverlayPosition.TOP_RIGHT
  }
  if (
    !containsXY(extent, position.BOTTOM.x, position.BOTTOM.y) &&
    !containsXY(extent, position.LEFT.x, position.LEFT.y)
  ) {
    return OverlayPosition.BOTTOM_LEFT
  }
  if (
    !containsXY(extent, position.BOTTOM.x, position.BOTTOM.y) &&
    !containsXY(extent, position.RIGHT.x, position.RIGHT.y)
  ) {
    return OverlayPosition.BOTTOM_RIGHT
  }
  if (!containsXY(extent, position.TOP.x, position.TOP.y)) {
    return OverlayPosition.BOTTOM
  }
  if (!containsXY(extent, position.RIGHT.x, position.RIGHT.y)) {
    return OverlayPosition.RIGHT
  }
  if (!containsXY(extent, position.LEFT.x, position.LEFT.y)) {
    return OverlayPosition.LEFT
  }
  if (!containsXY(extent, position.BOTTOM.x, position.BOTTOM.y)) {
    return OverlayPosition.TOP
  }

  return OverlayPosition.TOP
}

export function getOverlayPositionForExtent(
  featureExtent: Extent,
  extent: Extent,
  boxSize: {
    height: number
    resolution: number
    width: number
  }
) {
  const position = getOuterExtentPositionForExtent(featureExtent, boxSize)
  const [xTop, yTop, xBottom, yBottom] = featureExtent as [number, number, number, number]
  if (containsXY(extent, position.TOP_LEFT.x, position.TOP_LEFT.y) && containsXY(extent, xTop, yTop)) {
    return OverlayPosition.TOP_LEFT
  }
  if (containsXY(extent, position.TOP_RIGHT.x, position.TOP_RIGHT.y) && containsXY(extent, xTop, yBottom)) {
    return OverlayPosition.TOP_RIGHT
  }
  if (containsXY(extent, position.BOTTOM_RIGHT.x, position.BOTTOM_RIGHT.y) && containsXY(extent, xBottom, yBottom)) {
    return OverlayPosition.BOTTOM_RIGHT
  }
  if (containsXY(extent, position.BOTTOM_LEFT.x, position.BOTTOM_RIGHT.y) && containsXY(extent, xTop, yBottom)) {
    return OverlayPosition.BOTTOM_LEFT
  }

  return OverlayPosition.CENTER
}

/**
 * Get the [top, left] overlay margins to use for overlay placement
 * @param {OverlayPosition} nextOverlayPosition
 * @param {{
    xRight,
    xMiddle,
    xLeft,
    yTop,
    yMiddle,
    yBottom,
  }} margins
  * @param {number} resolution pixels/mapUnit
 * @returns {number[]} margins - The [top, left] overlay margins (and not the x, y margins)
 */
export function getTopLeftMarginForFeature(nextOverlayPosition, margins, extent, featureCenter, boxSize) {
  const {
    left: { center, left, right },
    top: { bottom, middle, top }
  } = margins

  const [xTop, yTop] = extent
  const [x, y] = featureCenter
  const marginWidth = (xTop - x) / boxSize.resolution
  const marginHeight = (yTop - y) / boxSize.resolution

  switch (nextOverlayPosition) {
    case OverlayPosition.TOP_LEFT:
      return [marginHeight - top - boxSize.height, marginWidth - left - boxSize.width]
    case OverlayPosition.TOP_RIGHT:
      return [marginHeight - top - boxSize.height, marginWidth - right]
    case OverlayPosition.BOTTOM_LEFT:
      return [bottom, marginWidth - left - boxSize.width]
    case OverlayPosition.BOTTOM_RIGHT:
      return [bottom, marginWidth - right]
    case OverlayPosition.TOP:
      return [marginHeight - top - boxSize.height, center]
    case OverlayPosition.RIGHT:
      return [marginHeight / 2 - middle - boxSize.height, right]
    case OverlayPosition.BOTTOM:
      return [bottom, center]
    case OverlayPosition.LEFT:
      return [marginHeight / 2 - middle - boxSize.height, marginWidth - left - boxSize.width]
    default:
      return [bottom, middle]
  }
}
