import { Point } from 'ol/geom'

import { updateCurrentInterestPoint, type InterestPointState } from '../../slice'

import type { Draw } from 'ol/interaction'
import type { DrawEvent } from 'ol/interaction/Draw'
import type { Dispatch } from 'redux'

const DRAW_START_EVENT = 'drawstart'
export const startDrawingAction =
  (drawObject: Draw) => (dispatch: Dispatch, getState: () => { interestPoint: InterestPointState }) => {
    const { currentInterestPoint }: InterestPointState = getState().interestPoint

    drawObject.once(DRAW_START_EVENT, event => {
      function startDrawing(e: DrawEvent) {
        const geometry = e.feature.getGeometry()
        if (geometry instanceof Point) {
          const coordinates = geometry.getCoordinates()

          dispatch(
            updateCurrentInterestPoint({
              coordinates,
              name: currentInterestPoint.name,
              observations: currentInterestPoint.observations,
              uuid: currentInterestPoint.uuid
            })
          )
        }
      }

      startDrawing(event)
    })
  }
