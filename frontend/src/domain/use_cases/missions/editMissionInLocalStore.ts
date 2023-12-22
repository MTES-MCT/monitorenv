import { generatePath } from 'react-router'

import { missionsAPI } from '../../../api/missionsAPI'
import { attachReportingToMissionSliceActions } from '../../../features/missions/MissionForm/AttachReporting/slice'
import { missionFormsActions } from '../../../features/missions/MissionForm/slice'
import { removeMissionListener } from '../../../features/missions/MissionForm/sse'
import { missionActions } from '../../../features/missions/slice'
import { sideWindowActions } from '../../../features/SideWindow/slice'
import { sideWindowPaths } from '../../entities/sideWindow'
import { setToast } from '../../shared_slices/Global'

export const editMissionInLocalStore = (missionId: number) => async (dispatch, getState) => {
  const { missions } = getState().missionForms

  const missionToEdit = missionsAPI.endpoints.getMission

  if (missions[missionId]) {
    setMission(dispatch, missions[missionId])
  } else {
    try {
      const missionRequest = dispatch(missionToEdit.initiate(missionId))
      const missionResponse = await missionRequest.unwrap()

      if (!missionResponse) {
        throw Error()
      }

      const missionToSave = missionResponse
      const missionFormatted = {
        isFormDirty: false,
        missionForm: missionToSave
      }

      setMission(dispatch, missionFormatted)

      await missionRequest.unsubscribe()
    } catch (error) {
      removeMissionListener(missionId)
      dispatch(
        setToast({ containerId: 'sideWindow', message: 'Erreur à la création ou à la modification de la mission' })
      )
    }
  }
}

async function setMission(dispatch, mission) {
  await dispatch(missionFormsActions.setMission(mission))
  await dispatch(missionActions.setSelectedMissionIdOnMap(mission.missionForm.id))
  await dispatch(
    attachReportingToMissionSliceActions.setAttachedReportings(mission.missionForm.attachedReportings || [])
  )
  await dispatch(sideWindowActions.focusAndGoTo(generatePath(sideWindowPaths.MISSION, { id: mission.missionForm.id })))
}
