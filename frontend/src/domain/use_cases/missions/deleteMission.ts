import { missionsAPI } from '../../../api/missionsAPI'
import { missionFormsActions } from '../../../features/missions/MissionForm/slice'
import { sideWindowActions } from '../../../features/SideWindow/slice'
import { sideWindowPaths } from '../../entities/sideWindow'
import { setToast } from '../../shared_slices/Global'
import { MapInteractionListenerEnum, updateMapInteractionListeners } from '../map/updateMapInteractionListeners'

export const deleteMissionAndGoToMissionsList = id => async dispatch => {
  try {
    const response = await dispatch(missionsAPI.endpoints.deleteMission.initiate({ id }))
    if ('error' in response) {
      throw Error('Erreur à la suppression de la mission')
    }

    await dispatch(missionFormsActions.deleteSelectedMission(id))
    await dispatch(updateMapInteractionListeners(MapInteractionListenerEnum.NONE))
    await dispatch(sideWindowActions.focusAndGoTo(sideWindowPaths.MISSIONS))
  } catch (error) {
    dispatch(setToast({ containerId: 'sideWindow', message: error }))
  }
}
