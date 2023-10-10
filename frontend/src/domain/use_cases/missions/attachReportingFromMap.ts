import { reportingsAPI } from '../../../api/reportingsAPI'
import { attachReportingToMissionSliceActions } from '../../../features/missions/MissionForm/AttachReporting/slice'
import { setToast } from '../../shared_slices/Global'

export const attachReportingFromMap = (id: number) => async (dispatch, getState) => {
  const { attachedReportings } = getState().attachReportingToMission
  const { attachedReportingIds } = getState().attachReportingToMission
  const missionId = getState().missionState.missionState.id
  try {
    if (attachedReportingIds.includes(id)) {
      return
    }

    const response = await dispatch(reportingsAPI.endpoints.getReporting.initiate(id))
    if ('error' in response) {
      throw Error("Erreur à l'ajout du signalement")
    } else {
      dispatch(
        attachReportingToMissionSliceActions.setAttachedReportings([
          ...attachedReportings,
          {
            ...response.data,
            attachedMissionId: missionId
          }
        ])
      )
      dispatch(
        attachReportingToMissionSliceActions.setAttachedReportingIds([...attachedReportingIds, response.data.id])
      )
    }
  } catch (error) {
    dispatch(setToast({ containerId: 'sideWindow', message: error }))
  }
}
