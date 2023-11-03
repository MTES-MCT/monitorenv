import omit from 'lodash/omit'

import { missionsAPI } from '../../../api/missionsAPI'
import { sideWindowActions } from '../../../features/SideWindow/slice'
import { isNewMission } from '../../../utils/isNewMission'
import { getMissionPageRoute } from '../../../utils/routes'
import { sideWindowPaths } from '../../entities/sideWindow'
import { setToast } from '../../shared_slices/Global'
import { multiMissionsActions } from '../../shared_slices/MultiMissions'
import { MapInteractionListenerEnum, updateMapInteractionListeners } from '../map/updateMapInteractionListeners'

export const saveMission =
  (values, reopen = false) =>
  async (dispatch, getState) => {
    const {
      sideWindow: { currentPath }
    } = getState()
    const valuesToSave = omit(values, ['attachedReportings', 'detachedReportings', 'detachedReportingIds'])
    const routeParams = getMissionPageRoute(currentPath)
    const missionIsNewMission = isNewMission(routeParams?.params?.id)

    const cleanValues = missionIsNewMission ? { ...valuesToSave, id: undefined } : valuesToSave
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
        dispatch(updateMapInteractionListeners(MapInteractionListenerEnum.NONE))
        dispatch(sideWindowActions.focusAndGoTo(sideWindowPaths.MISSIONS))
      } else {
        throw Error('Erreur à la création ou à la modification de la mission')
      }
    } catch (error) {
      dispatch(setToast({ containerId: 'sideWindow', message: error }))
    }
  }
