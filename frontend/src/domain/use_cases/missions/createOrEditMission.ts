import { missionsAPI } from '../../../api/missionsAPI'
import { sideWindowActions } from '../../../features/SideWindow/slice'
import { getMissionPageRoute } from '../../../utils/getMissionPageRoute'
import { isNewMission } from '../../../utils/isNewMission'
import { sideWindowPaths } from '../../entities/sideWindow'
import { setToast } from '../../shared_slices/Global'
import { multiMissionsActions } from '../../shared_slices/MultiMissions'

export const createOrEditMission =
  (values, reopen = false) =>
  async (dispatch, getState) => {
    const {
      sideWindow: { currentPath }
    } = getState()
    const routeParams = getMissionPageRoute(currentPath)
    const missionIsNewMission = isNewMission(routeParams?.params?.id)

    const cleanValues = missionIsNewMission ? { ...values, id: undefined } : values
    const upsertMission = missionIsNewMission
      ? missionsAPI.endpoints.createMission
      : missionsAPI.endpoints.updateMission
    try {
      const response = await dispatch(upsertMission.initiate(cleanValues))
      if ('data' in response) {
        if (reopen) {
          return
        }
        dispatch(multiMissionsActions.deleteSelectedMission(values.id))
        dispatch(sideWindowActions.focusAndGoTo(sideWindowPaths.MISSIONS))
      } else {
        throw Error('Erreur à la création ou à la modification de la mission')
      }
    } catch (error) {
      dispatch(setToast({ containerId: 'sideWindow', message: error }))
    }
  }
