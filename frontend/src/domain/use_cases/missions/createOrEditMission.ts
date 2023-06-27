import { missionsAPI } from '../../../api/missionsAPI'
import { sideWindowActions } from '../../../features/SideWindow/slice'
import { newMissionPageRoute } from '../../../utils/isEditOrNewMissionPage'
import { sideWindowPaths } from '../../entities/sideWindow'
import { setToast } from '../../shared_slices/Global'
import { setMissionState } from '../../shared_slices/MissionsState'
import { multiMissionsActions } from '../../shared_slices/MultiMissions'

export const createOrEditMission =
  (values, reopen = false) =>
  async (dispatch, getState) => {
    const {
      sideWindow: { currentPath }
    } = getState()
    const isNewMission = !!newMissionPageRoute(currentPath)
    const cleanValues = isNewMission ? { ...values, id: undefined } : values
    const upsertMission = isNewMission ? missionsAPI.endpoints.createMission : missionsAPI.endpoints.updateMission
    try {
      const response = await dispatch(upsertMission.initiate(cleanValues))
      if ('data' in response) {
        if (reopen) {
          dispatch(setMissionState(response.data))

          return
        }
        dispatch(multiMissionsActions.deleteSelectedMission(values.id))
        dispatch(setMissionState(undefined))
        dispatch(sideWindowActions.focusAndGoTo(sideWindowPaths.MISSIONS))
      } else {
        throw Error('Erreur à la création ou à la modification de la mission')
      }
    } catch (error) {
      dispatch(setToast({ containerId: 'sideWindow', message: error }))
    }
  }
