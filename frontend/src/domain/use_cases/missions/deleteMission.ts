import { missionsAPI } from '../../../api/missionsAPI'
import { sideWindowActions } from '../../../features/SideWindow/slice'
import { sideWindowPaths } from '../../entities/sideWindow'
import { setToast } from '../../shared_slices/Global'
import { deleteMissionFromMultiMissionState } from '../../shared_slices/MultiMissionsState'

export const deleteMissionAndGoToMissionsList = id => dispatch => {
  dispatch(missionsAPI.endpoints.deleteMission.initiate({ id }))
    .then(response => {
      if ('error' in response) {
        throw Error('Erreur à la suppression de la mission')
      } else {
        dispatch(deleteMissionFromMultiMissionState(id))
        dispatch(sideWindowActions.focusAndGoTo(sideWindowPaths.MISSIONS))
      }
    })
    .catch(error => {
      dispatch(setToast({ containerId: 'sideWindow', message: error }))
    })
}
