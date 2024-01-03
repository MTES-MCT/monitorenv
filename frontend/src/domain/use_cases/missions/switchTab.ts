import { attachReportingToMissionSliceActions } from '../../../features/missions/MissionForm/AttachReporting/slice'
import { missionFormsActions } from '../../../features/missions/MissionForm/slice'
import { missionActions } from '../../../features/missions/slice'
import { sideWindowActions } from '../../../features/SideWindow/slice'
import { getIdTyped } from '../../../utils/getIdTyped'
import { getMissionPageRoute } from '../../../utils/routes'

export const switchTab = path => async (dispatch, getState) => {
  const { missions } = getState().missionForms

  const routeParams = getMissionPageRoute(path)
  const id = getIdTyped(routeParams?.params.id)

  // if we want to switch to mission list
  if (!id) {
    await dispatch(sideWindowActions.setCurrentPath(path))
    await dispatch(missionActions.resetSelectedMissionIdOnMap())
    await dispatch(missionFormsActions.resetActiveMissionId())

    return
  }

  await dispatch(missionFormsActions.setMission(missions[id]))
  await dispatch(missionActions.setSelectedMissionIdOnMap(id))

  // since we are switching to another mission, we need to update the attached reportings store
  // because it's the form who listen to this store
  await dispatch(
    attachReportingToMissionSliceActions.setAttachedReportings(missions[id]?.missionForm?.attachedReportings || [])
  )

  await dispatch(sideWindowActions.setCurrentPath(path))
}
