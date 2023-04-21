import { missionsAPI } from '../../../api/missionsAPI'
import { sideWindowActions } from '../../../features/SideWindow/slice'
import { sideWindowPaths } from '../../entities/sideWindow'
import { setError } from '../../shared_slices/Global'

export const createOrEditMissionAndGoToMissionsList = values => dispatch => {
  const upsertMission = !values.id ? missionsAPI.endpoints.createMission : missionsAPI.endpoints.updateMission
  dispatch(upsertMission.initiate(values)).then(response => {
    if ('data' in response) {
      dispatch(sideWindowActions.focusAndGoTo(sideWindowPaths.MISSIONS))
    } else {
      dispatch(setError(response.error))
    }
  })
}
