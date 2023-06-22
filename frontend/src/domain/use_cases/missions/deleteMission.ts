import { missionsAPI } from '../../../api/missionsAPI'
import { sideWindowActions } from '../../../features/SideWindow/slice'
import { sideWindowPaths } from '../../entities/sideWindow'
import { setToast } from '../../shared_slices/Global'

export const deleteMissionAndGoToMissionsList = id => (dispatch, getState) => {
  const { sideWindow } = getState()
  dispatch(missionsAPI.endpoints.deleteMission.initiate({ id }))
    .then(response => {
      if ('error' in response) {
        throw Error('Erreur à la suppression de la mission')
      } else {
        dispatch(sideWindowActions.focusAndGoTo(sideWindow.nextPath || sideWindowPaths.MISSIONS))
      }
    })
    .catch(error => {
      dispatch(setToast({ containerId: 'sideWindow', message: error }))
    })
}
