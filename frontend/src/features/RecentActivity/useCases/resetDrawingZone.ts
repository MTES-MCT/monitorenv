import { InteractionType } from 'domain/entities/map/constants'

import { recentActivityActions } from '../slice'

import type { HomeAppThunk } from '@store/index'

export const resetDrawingZone = (): HomeAppThunk => dispatch => {
  dispatch(recentActivityActions.setInteractionType(InteractionType.POLYGON))
  dispatch(recentActivityActions.setGeometry({ coordinates: [], type: 'MultiPolygon' }))
}
