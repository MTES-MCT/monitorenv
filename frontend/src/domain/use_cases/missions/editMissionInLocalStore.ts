import { generatePath } from 'react-router'

import { missionsAPI } from '../../../api/missionsAPI'
import { attachReportingToMissionSliceActions } from '../../../features/missions/MissionForm/AttachReporting/slice'
// import * as mockMission from '../../../features/missions/MissionForm/mission.json'
import { sideWindowActions } from '../../../features/SideWindow/slice'
import { sideWindowPaths } from '../../entities/sideWindow'
import { setToast } from '../../shared_slices/Global'
import { multiMissionsActions } from '../../shared_slices/MultiMissions'

export const editMissionInLocalStore = missionId => async (dispatch, getState) => {
  const {
    missionState: { isFormDirty, missionState },
    multiMissions: { selectedMissions }
  } = getState()

  const missionToEdit = missionsAPI.endpoints.getMission
  try {
    const response = await dispatch(missionToEdit.initiate(missionId))
    if ('data' in response) {
      const missions = [...selectedMissions]
      // first we want to save the active mission in multiMissions state
      if (missionState) {
        const selectedMissionIndex = missions.findIndex(mission => mission.mission.id === missionState.id)

        const missionFormatted = {
          isFormDirty,
          mission: missionState
        }

        if (selectedMissionIndex !== -1) {
          missions[selectedMissionIndex] = missionFormatted
        } else {
          missions.push(missionFormatted)
        }
      }

      // now we want to save in multiMissions state the mission we want to edit
      const missionToSave = response.data
      // const { mission: missionToSave } = mockMission
      const newSelectedMissionIndex = missions.findIndex(mission => mission.mission.id === missionToSave?.id)
      const missionFormatted = {
        isFormDirty: false,
        mission: missionToSave
      }

      if (newSelectedMissionIndex === -1) {
        missions.push(missionFormatted)
      }

      await dispatch(multiMissionsActions.setSelectedMissions(missions))
      await dispatch(attachReportingToMissionSliceActions.setAttachedReportings(missionToSave.attachedReportings || []))
      await dispatch(
        attachReportingToMissionSliceActions.setAttachedReportingIds(missionToSave.attachedReportingIds || [])
      )
      await dispatch(sideWindowActions.focusAndGoTo(generatePath(sideWindowPaths.MISSION, { id: missionId })))
    } else {
      throw Error('Erreur à la création ou à la modification de la mission')
    }
  } catch (error) {
    dispatch(setToast({ containerId: 'sideWindow', message: error }))
  }
}
