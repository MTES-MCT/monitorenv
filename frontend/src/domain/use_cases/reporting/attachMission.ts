import { missionsAPI } from '../../../api/missionsAPI'
import { attachMissionToReportingSliceActions } from '../../../features/Reportings/slice'
import { setToast } from '../../shared_slices/Global'

export const attachMission = (id: number) => async (dispatch, getState) => {
  const { missionId } = getState().attachMissionToReporting

  if (missionId === id) {
    return
  }

  try {
    const missionRequest = dispatch(missionsAPI.endpoints.getMission.initiate(id))
    const missionResponse = await missionRequest.unwrap()
    if (!missionResponse) {
      throw Error()
    }

    await dispatch(attachMissionToReportingSliceActions.setAttachedMission(missionResponse))

    await missionRequest.unsubscribe()
  } catch (error) {
    dispatch(setToast({ containerId: 'sideWindow', message: "Erreur à l'ajout du signalement" }))
  }
}
