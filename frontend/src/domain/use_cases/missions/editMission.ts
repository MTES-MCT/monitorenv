import { generatePath } from 'react-router'

import { missionsAPI } from '../../../api/missionsAPI'
import { sideWindowActions } from '../../../features/SideWindow/slice'
import { sideWindowPaths } from '../../entities/sideWindow'
import { setToast } from '../../shared_slices/Global'
import { setMissionState } from '../../shared_slices/MissionsState'
import { multiMissionsActions } from '../../shared_slices/MultiMissions'

export const editMission = missionId => async (dispatch, getState) => {
  const {
    missionState: { isFormDirty, missionState },
    multiMissions: { selectedMissions }
  } = getState()

  const missionToEdit = missionsAPI.endpoints.getMission
  try {
    const response = await dispatch(missionToEdit.initiate(missionId))
    if ('data' in response) {
      const newSelectedMission = selectedMissions.find(mission => mission.mission.id === missionId)

      const missions = [...selectedMissions]
      const missionToSave = missionState || response.data

      const missionStateIndex = missions.findIndex(mission => mission.mission.id === missionState?.id)
      const missionFormatted = {
        isFormDirty: missionState ? isFormDirty : false,
        mission: missionToSave,
        type: missionState && missionStateIndex !== -1 ? missions[missionStateIndex].type : 'edit'
      }

      const missionIndex = missions.findIndex(mission => mission.mission.id === missionToSave.id)

      if (missionIndex !== -1) {
        missions[missionIndex] = missionFormatted
      } else {
        missions.push(missionFormatted)
      }

      // when mission already open
      if (newSelectedMission) {
        await dispatch(setMissionState(newSelectedMission.mission))
      } else {
        // when we have to open a new tab
        const newMissionIndex = missions.findIndex(mission => mission.mission.id === missionId)
        const newMissionFormatted = {
          isFormDirty: false,
          mission: response.data,
          type: 'edit'
        }

        if (newMissionIndex !== -1) {
          missions[newMissionIndex] = {
            ...missionFormatted,
            isFormDirty: missions[newMissionIndex].isFormDirty
          }
        } else {
          missions.push(newMissionFormatted)
        }

        await dispatch(setMissionState(response.data))
      }

      await dispatch(multiMissionsActions.setSelectedMissions(missions))
      await dispatch(sideWindowActions.focusAndGoTo(generatePath(sideWindowPaths.MISSION, { id: missionId })))
    } else {
      throw Error('Erreur à la création ou à la modification de la mission')
    }
  } catch (error) {
    dispatch(setToast({ containerId: 'sideWindow', message: error }))
  }
}
