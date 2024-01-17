import { monitorFishMissionActions } from '../../../api/monitorFishMissionActions'
import { setToast } from '../../shared_slices/Global'

export const getMissionActionsFromFish = (missionId: number) => async dispatch => {
  try {
    const endpoint = monitorFishMissionActions.endpoints.getFishMissionActions

    const missionActions = await dispatch(endpoint.initiate(missionId))

    if (!missionActions.data) {
      throw Error()
    }

    return missionActions.data
  } catch {
    return dispatch(setToast({ containerId: 'sideWindow', message: 'Erreur à la suppression de la mission' }))
  }
}
