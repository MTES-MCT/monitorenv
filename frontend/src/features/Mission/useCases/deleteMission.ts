import { missionFormsActions } from '@features/Mission/components/MissionForm/slice'

import { missionsAPI } from '../../../api/missionsAPI'
import { sideWindowPaths } from '../../../domain/entities/sideWindow'
import { setToast } from '../../../domain/shared_slices/Global'
import {
  MapInteractionListenerEnum,
  updateMapInteractionListeners
} from '../../../domain/use_cases/map/updateMapInteractionListeners'
import { sideWindowActions } from '../../SideWindow/slice'

export const deleteMissionAndGoToMissionsList = id => async dispatch => {
  try {
    const response = await dispatch(missionsAPI.endpoints.deleteMission.initiate({ id }))
    if ('error' in response) {
      throw Error('Erreur à la suppression de la mission')
    }

    await dispatch(missionFormsActions.deleteSelectedMission(id))
    await dispatch(updateMapInteractionListeners(MapInteractionListenerEnum.NONE))
    await dispatch(sideWindowActions.focusAndGoTo(sideWindowPaths.MISSIONS))
  } catch (error) {
    dispatch(setToast({ containerId: 'sideWindow', message: error }))
  }
}
