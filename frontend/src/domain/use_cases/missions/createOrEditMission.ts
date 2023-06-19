import { missionsAPI } from '../../../api/missionsAPI'
import { sideWindowActions } from '../../../features/SideWindow/slice'
import { newMissionPageRoute } from '../../../utils/isEditOrNewMissionPage'
import { sideWindowPaths } from '../../entities/sideWindow'
import { setToast } from '../../shared_slices/Global'
import { deleteSelectedMissionId } from '../../shared_slices/MultiMissionsState'

export const createOrEditMission =
  (values, redirect = true) =>
  (dispatch, getState) => {
    const {
      sideWindow: { currentPath }
    } = getState()
    const isNewMission = !!newMissionPageRoute(currentPath)
    const cleanValues = isNewMission ? { ...values, id: undefined } : values
    const upsertMission = isNewMission ? missionsAPI.endpoints.createMission : missionsAPI.endpoints.updateMission
    dispatch(upsertMission.initiate(cleanValues))
      .then(response => {
        if ('data' in response) {
          dispatch(deleteSelectedMissionId(values.id))
          if (redirect) {
            dispatch(sideWindowActions.focusAndGoTo(sideWindowPaths.MISSIONS))
          }
        } else {
          throw Error('Erreur à la création ou à la modification de la mission')
        }
      })
      .catch(error => {
        dispatch(setToast({ containerId: 'sideWindow', message: error }))
      })
  }
