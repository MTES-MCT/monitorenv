import { getIdTyped } from '@features/missions/utils'

import { attachReportingToMissionSliceActions } from '../../../features/missions/MissionForm/AttachReporting/slice'
import { missionFormsActions } from '../../../features/missions/MissionForm/slice'
import { missionActions } from '../../../features/missions/slice'
import { sideWindowActions } from '../../../features/SideWindow/slice'
import { getMissionPageRoute } from '../../../utils/routes'

import type { HomeAppThunk } from '@store/index'

export const switchTab =
  (path: string): HomeAppThunk =>
  async (dispatch, getState) => {
    const { missions } = getState().missionForms

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

    // since we are switching to another mission, we need to update the attached reportings store
    // because it's the form who listen to this store
    dispatch(
      attachReportingToMissionSliceActions.setAttachedReportings(missions[id]?.missionForm?.attachedReportings ?? [])
    )
  }
