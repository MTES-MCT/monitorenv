import { attachMissionToReportingSliceActions } from '@features/Reportings/components/ReportingForm/AttachMission/slice'
import { Level } from '@mtes-mct/monitor-ui'

import { missionsAPI } from '../../../api/missionsAPI'
import { displayReportingBanner } from '../utils'

export const attachMission = (id: number) => async (dispatch, getState) => {
  const { missionId } = getState().attachMissionToReporting
  const { reportings } = getState().reporting
  const reportingContext = reportings[id]?.context

  if (missionId === id) {
    return
  }

  try {
    const missionRequest = dispatch(missionsAPI.endpoints.getMission.initiate(id))
    const missionResponse = await missionRequest.unwrap()
    if (!missionResponse.mission) {
      throw Error()
    }

    await dispatch(attachMissionToReportingSliceActions.setAttachedMission(missionResponse.mission))

    await missionRequest.unsubscribe()
  } catch (error) {
    displayReportingBanner({
      context: reportingContext,
      dispatch,
      level: Level.ERROR,
      message: 'Erreur lors du rattachement de la mission'
    })
  }
}
