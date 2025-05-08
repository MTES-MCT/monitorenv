import { InteractionType } from 'domain/entities/map/constants'

import { dashboardActions } from '../slice'

import type { HomeAppThunk } from '@store/index'

export const resetDrawing = (): HomeAppThunk => dispatch => {
  dispatch(dashboardActions.setInteractionType(InteractionType.CIRCLE))
  dispatch(dashboardActions.setGeometry({ coordinates: [], type: 'MultiPolygon' }))
  dispatch(dashboardActions.setInitialGeometry(undefined))
}
