import { missionsAPI } from '../../../api/missionsAPI'
import { attachMissionToReportingSliceActions } from '../../../features/Reportings/slice'
import { setToast } from '../../shared_slices/Global'

import type { HomeAppThunk } from '@store/index'

export const attachMission =
  (id: number): HomeAppThunk =>
  async (dispatch, getState) => {
    const { missionId } = getState().attachMissionToReporting

    if (missionId === id) {
      return
    }

    try {
      const missionRequest = dispatch(missionsAPI.endpoints.getMission.initiate(id))
      const missionResponse = await missionRequest.unwrap()
      if (!missionResponse.mission) {
        throw Error()
      }

      dispatch(attachMissionToReportingSliceActions.setAttachedMission(missionResponse.mission))

      missionRequest.unsubscribe()
    } catch (error) {
      dispatch(setToast({ containerId: 'sideWindow', message: "Erreur à l'ajout du signalement" }))
    }
  }
