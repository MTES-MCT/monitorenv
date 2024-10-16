import { InteractionListener, InteractionType } from '../../entities/map/constants'
import { setGeometry, setInitialGeometry, setInteractionTypeAndListener } from '../../shared_slices/Draw'
import { MapInteractionListenerEnum, updateMapInteractionListeners } from '../map/updateMapInteractionListeners'

import type { GeoJSON as GeoJSONNamespace } from '../../types/GeoJSON'

export const drawPolygon =
  (geometry: GeoJSONNamespace.Geometry | undefined, listener: InteractionListener) => dispatch => {
    if (geometry) {
      dispatch(setGeometry(geometry))
      dispatch(setInitialGeometry(geometry))
    }

    dispatch(updateMapInteractionListeners(MapInteractionListenerEnum.DRAW_ZONE_OR_POINT))
    dispatch(
      setInteractionTypeAndListener({
        listener,
        type: InteractionType.POLYGON
      })
    )
  }

export const drawCircle =
  (geometry: GeoJSONNamespace.Geometry | undefined, listener: InteractionListener) => dispatch => {
    if (geometry) {
      dispatch(setGeometry(geometry))
      dispatch(setInitialGeometry(geometry))
    }

    dispatch(updateMapInteractionListeners(MapInteractionListenerEnum.DRAW_ZONE_OR_POINT))
    dispatch(
      setInteractionTypeAndListener({
        listener,
        type: InteractionType.CIRCLE
      })
    )
  }

export const drawPoint =
  (geometry: GeoJSONNamespace.Geometry | undefined, listener?: InteractionListener) => dispatch => {
    if (geometry) {
      dispatch(setGeometry(geometry))
      dispatch(setInitialGeometry(geometry))
    }

    dispatch(updateMapInteractionListeners(MapInteractionListenerEnum.DRAW_ZONE_OR_POINT))
    dispatch(
      setInteractionTypeAndListener({
        listener: listener ?? InteractionListener.CONTROL_POINT,
        type: InteractionType.POINT
      })
    )
  }
