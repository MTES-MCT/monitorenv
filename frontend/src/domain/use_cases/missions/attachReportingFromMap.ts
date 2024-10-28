import { isNewMission } from '@utils/isNewMission'

import { reportingsAPI } from '../../../api/reportingsAPI'
import { attachReportingToMissionSliceActions } from '../../../features/missions/MissionForm/AttachReporting/slice'
import { setToast } from '../../shared_slices/Global'

import type { HomeAppThunk } from '@store/index'

export const attachReportingFromMap =
  (reportingId: number): HomeAppThunk =>
  async (dispatch, getState) => {
    const { attachedReportingIds, attachedReportings } = getState().attachReportingToMission
    const missionId = getState().missionForms.activeMissionId

    if (attachedReportingIds.includes(reportingId)) {
      return
    }

    try {
      const reportingRequest = dispatch(reportingsAPI.endpoints.getReporting.initiate(reportingId))
      const reportingResponse = await reportingRequest.unwrap()
      if (!reportingResponse) {
        throw Error()
      }

      dispatch(
        attachReportingToMissionSliceActions.setAttachedReportings([
          ...attachedReportings,
          { ...reportingResponse, missionId: !missionId || isNewMission(missionId) ? undefined : +missionId }
        ])
      )

      reportingRequest.unsubscribe()
    } catch (error) {
      dispatch(setToast({ containerId: 'sideWindow', message: "Erreur à l'ajout du signalement" }))
    }
  }
