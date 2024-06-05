import type { NewInterestPoint } from '@features/InterestPoint/types'
import type Feature from 'ol/Feature'
import type { LineString } from 'ol/geom'

export const interestPointType = {
  CONTROL_ENTITY: 'CONTROL_ENTITY',
  FISHING_VESSEL: 'FISHING_VESSEL',
  OTHER: 'OTHER'
}

export const INTEREST_POINT_STYLE_ZINDEX = 150
export const INTEREST_POINT_STYLE_ICON_FILENAME = 'interest_point.svg'

export function areFeatureCoordinatesModified(feature: Feature<LineString>, interestPoint: NewInterestPoint) {
  return (
    feature &&
    interestPoint.coordinates &&
    !Number.isNaN(feature.getGeometry()?.getCoordinates()[0]) &&
    !Number.isNaN(feature.getGeometry()?.getCoordinates()[1]) &&
    !Number.isNaN(interestPoint.coordinates[0]) &&
    !Number.isNaN(interestPoint.coordinates[1]) &&
    (feature.getGeometry()?.getCoordinates()[0] !== interestPoint.coordinates[0] ||
      feature.getGeometry()?.getCoordinates()[1] !== interestPoint.coordinates[1])
  )
}

export function areCoordinatesModified(
  interestPoint: NewInterestPoint,
  previousInterestPoint: NewInterestPoint | undefined
) {
  return (
    interestPoint &&
    previousInterestPoint &&
    interestPoint.coordinates &&
    previousInterestPoint.coordinates &&
    !Number.isNaN(interestPoint.coordinates[0]) &&
    !Number.isNaN(interestPoint.coordinates[1]) &&
    !Number.isNaN(previousInterestPoint.coordinates[0]) &&
    !Number.isNaN(previousInterestPoint.coordinates[1]) &&
    (interestPoint.coordinates[0] !== previousInterestPoint.coordinates[0] ||
      interestPoint.coordinates[1] !== previousInterestPoint.coordinates[1])
  )
}
