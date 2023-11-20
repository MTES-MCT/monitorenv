import { missionsAPI } from '../../../api/missionsAPI'
import { removeMissionListener } from '../../../features/missions/MissionForm/sse'
import { sideWindowActions } from '../../../features/SideWindow/slice'
import { sideWindowPaths } from '../../entities/sideWindow'
import { setToast } from '../../shared_slices/Global'
import { multiMissionsActions } from '../../shared_slices/MultiMissions'
import { MapInteractionListenerEnum, updateMapInteractionListeners } from '../map/updateMapInteractionListeners'

export const deleteMissionAndGoToMissionsList = id => async dispatch => {
  try {
    const response = await dispatch(missionsAPI.endpoints.deleteMission.initiate({ id }))
    if ('error' in response) {
      throw Error('Erreur à la suppression de la mission')
    }

    removeMissionListener(id)
    dispatch(multiMissionsActions.deleteSelectedMission(id))
    dispatch(updateMapInteractionListeners(MapInteractionListenerEnum.NONE))
    dispatch(sideWindowActions.focusAndGoTo(sideWindowPaths.MISSIONS))
  } catch (error) {
    dispatch(setToast({ containerId: 'sideWindow', message: error }))
  }
}
