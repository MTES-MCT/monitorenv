import { vesselAction } from '../slice'

import type { HomeAppThunk } from '@store/index'

export const closeVesselResume = (): HomeAppThunk => dispatch => {
  dispatch(vesselAction.resetState())
}
