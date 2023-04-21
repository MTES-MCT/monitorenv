import { missionsAPI } from '../../../api/missionsAPI'
import { sideWindowActions } from '../../../features/SideWindow/slice'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { sideWindowPaths } from '../../entities/sideWindow'
import { setError } from '../../shared_slices/Global'

export const deleteMissionAndGoToMissionsList = id => dispatch => {
  const { sideWindow } = useAppSelector(state => state)

  dispatch(missionsAPI.endpoints.deleteMission.initiate({ id })).then(response => {
    if ('error' in response) {
      dispatch(setError(response.error))
    } else {
      dispatch(sideWindowActions.focusAndGoTo(sideWindow.nextPath || sideWindowPaths.MISSIONS))
    }
  })
}
