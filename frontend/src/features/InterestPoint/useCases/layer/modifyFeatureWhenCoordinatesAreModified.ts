import { OPENLAYERS_PROJECTION } from '@mtes-mct/monitor-ui'
import { areFeatureCoordinatesModified } from 'domain/entities/interestPoints'
import { GeoJSON } from 'ol/format'

import { type InterestPointState, updateCurrentInterestPoint } from '../../slice'

import type { Coordinate } from 'ol/coordinate'
import type { Dispatch } from 'redux'

export const modifyFeatureWhenCoordinatesAreModifiedAction =
  vectorSource => (dispatch: Dispatch, getState: () => { interestPoint: InterestPointState }) => {
    const { currentInterestPoint }: InterestPointState = getState().interestPoint
    if (currentInterestPoint.coordinates?.length) {
      const drawingFeatureToUpdate = vectorSource.current.getFeatureById(currentInterestPoint.uuid)

      if (drawingFeatureToUpdate && areFeatureCoordinatesModified(drawingFeatureToUpdate, currentInterestPoint)) {
        const { feature, ...interestPointWithoutFeature } = currentInterestPoint

        const geometry = drawingFeatureToUpdate.getGeometry()
        if (interestPointWithoutFeature.coordinates) {
          // FIXME [17/05/2024] typage à refacto: Openlayer fonctionne avec Coordinate[] et Coordinate
          geometry?.setCoordinates(interestPointWithoutFeature.coordinates as unknown as Coordinate[])
        }
        drawingFeatureToUpdate.setProperties(interestPointWithoutFeature)

        const nextFeature = new GeoJSON().writeFeatureObject(drawingFeatureToUpdate, {
          featureProjection: OPENLAYERS_PROJECTION
        })

        const { feature: currentFeature, ...currentInterestPointWithoutFeature } = currentInterestPoint

        dispatch(updateCurrentInterestPoint({ feature: nextFeature, ...currentInterestPointWithoutFeature }))
      }
    }
  }
