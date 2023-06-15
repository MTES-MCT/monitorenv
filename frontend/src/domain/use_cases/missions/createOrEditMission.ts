import { missionsAPI } from '../../../api/missionsAPI'
import { sideWindowActions } from '../../../features/SideWindow/slice'
import { sideWindowPaths } from '../../entities/sideWindow'
import { setError } from '../../shared_slices/Global'

export const createOrEditMissionAndGoToMissionsList = values => (dispatch, getState) => {
  const upsertMission = !values.id ? missionsAPI.endpoints.createMission : missionsAPI.endpoints.updateMission
  const {
    missionState: { isClosedMission }
  } = getState()
  dispatch(upsertMission.initiate({ ...values, isClosed: isClosedMission }))
    .then(response => {
      if ('data' in response) {
        dispatch(sideWindowActions.focusAndGoTo(sideWindowPaths.MISSIONS))
      } else {
        throw Error('Erreur à la création ou à la modification de la mission')
      }
    })
    .catch(error => {
      // eslint-disable-next-line no-param-reassign
      error.containerId = 'sideWindow'
      dispatch(setError(error))
    })
}
