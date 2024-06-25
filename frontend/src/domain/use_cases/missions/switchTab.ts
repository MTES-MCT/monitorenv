import { missionFormsActions } from '../../../features/missions/MissionForm/slice'
import { missionActions } from '../../../features/missions/slice'
import { sideWindowActions } from '../../../features/SideWindow/slice'
import { getIdTyped } from '../../../utils/getIdTyped'
import { getMissionPageRoute } from '../../../utils/routes'

import type { HomeAppThunk } from '@store/index'

export const switchTab =
  (path: string): HomeAppThunk =>
  async dispatch => {
    const routeParams = getMissionPageRoute(path)
    const id = getIdTyped(routeParams?.params.id)

    // if we want to switch to mission list
    if (!id) {
      dispatch(sideWindowActions.setCurrentPath(path))
      dispatch(missionActions.resetSelectedMissionIdOnMap())
      dispatch(missionFormsActions.resetActiveMissionId())

      return
    }

    dispatch(missionFormsActions.setActiveMissionId(id))
    dispatch(missionActions.setSelectedMissionIdOnMap(id))

    dispatch(sideWindowActions.setCurrentPath(path))
  }
