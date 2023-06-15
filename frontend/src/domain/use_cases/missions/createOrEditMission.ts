import { missionsAPI } from '../../../api/missionsAPI'
import { sideWindowActions } from '../../../features/SideWindow/slice'
import { sideWindowPaths } from '../../entities/sideWindow'
import { setError } from '../../shared_slices/Global'

export const createOrEditMissionAndGoToMissionsList =
  (values, redirect = true) =>
  dispatch => {
    const upsertMission = !values.id ? missionsAPI.endpoints.createMission : missionsAPI.endpoints.updateMission
    dispatch(upsertMission.initiate(values))
      .then(response => {
        if ('data' in response) {
          if (redirect) {
            dispatch(sideWindowActions.focusAndGoTo(sideWindowPaths.MISSIONS))
          }
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
