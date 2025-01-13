import { missionFormsActions } from '@features/Mission/components/MissionForm/slice'
import { missionActions } from '@features/Mission/slice'
import { sideWindowActions } from '@features/SideWindow/slice'

import { missionsAPI } from '../../../api/missionsAPI'
import { sideWindowPaths } from '../../../domain/entities/sideWindow'
import { setToast } from '../../../domain/shared_slices/Global'
import {
  MapInteractionListenerEnum,
  updateMapInteractionListeners
} from '../../../domain/use_cases/map/updateMapInteractionListeners'

import type { HomeAppDispatch, HomeAppThunk } from '@store/index'

export const deleteMissionAndGoToMissionsList =
  (id): HomeAppThunk =>
  async (dispatch: HomeAppDispatch) => {
    try {
      const response = await dispatch(missionsAPI.endpoints.deleteMission.initiate({ id }))
      if ('error' in response) {
        throw Error('Erreur à la suppression de la mission')
      }

      dispatch(missionFormsActions.deleteSelectedMission(id))
      dispatch(missionActions.resetSelectedMissionIdOnMap())
      dispatch(updateMapInteractionListeners(MapInteractionListenerEnum.NONE))
      dispatch(sideWindowActions.focusAndGoTo(sideWindowPaths.MISSIONS))
    } catch (error) {
      dispatch(setToast({ containerId: 'sideWindow', message: error }))
    }
  }
