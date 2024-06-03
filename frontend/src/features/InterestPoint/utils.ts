import { InterestPointLine } from 'domain/entities/interestPointLine'
import { type MutableRefObject } from 'react'

import type { InterestPoint } from './types'
import type { Feature } from 'ol'
import type { LineString } from 'ol/geom'
import type VectorSource from 'ol/source/Vector'

export const removeResidualElement = (
  uuid: string,
  savedInterestPoints: InterestPoint[],
  interestPointVectorSourceRef: MutableRefObject<VectorSource<Feature<LineString>>>
) => {
  function isNotPersisted() {
    return !savedInterestPoints.find(interestPoint => interestPoint.uuid === uuid)
  }
  if (isNotPersisted()) {
    removeLine(uuid, interestPointVectorSourceRef)
    removePoint(uuid, interestPointVectorSourceRef)
  }
}

export function removeLine(
  uuid: string,
  interestPointVectorSourceRef: MutableRefObject<VectorSource<Feature<LineString>>>
) {
  const featureLine = interestPointVectorSourceRef.current.getFeatureById(InterestPointLine.getFeatureId(uuid))

  if (featureLine) {
    interestPointVectorSourceRef.current.removeFeature(featureLine)
    interestPointVectorSourceRef.current.changed()
  }
}

export function removePoint(
  uuid: string,
  interestPointVectorSourceRef: MutableRefObject<VectorSource<Feature<LineString>>>
) {
  const feature = interestPointVectorSourceRef.current.getFeatureById(uuid)

  if (feature) {
    interestPointVectorSourceRef.current.removeFeature(feature)
    interestPointVectorSourceRef.current.changed()
  }
}
