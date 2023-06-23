import { generatePath } from 'react-router'

import { missionsAPI } from '../../../api/missionsAPI'
import { sideWindowActions } from '../../../features/SideWindow/slice'
import { sideWindowPaths } from '../../entities/sideWindow'
import { setError } from '../../shared_slices/Global'
import { setMissionState } from '../../shared_slices/MissionsState'
import { setMultiMissionsState } from '../../shared_slices/MultiMissionsState'

export const editMission = missionId => (dispatch, getState) => {
  const {
    missionState: { isFormDirty, missionState },
    multiMissionsState: { multiMissionsState }
  } = getState()

  const missionToEdit = missionsAPI.endpoints.getMission
  dispatch(missionToEdit.initiate(missionId))
    .then(async response => {
      if ('data' in response) {
        const newSelectedMission = multiMissionsState.find(mission => mission.mission.id === missionId)

        const missions = [...multiMissionsState]
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

        await dispatch(setMultiMissionsState(missions))
        await dispatch(sideWindowActions.focusAndGoTo(generatePath(sideWindowPaths.MISSION, { id: missionId })))
      } else {
        throw Error('Erreur à la création ou à la modification de la mission')
      }
    })
    .catch(error => {
      // eslint-disable-next-line no-param-reassign
      error.containerId = 'sideWindow'
      dispatch(setError(error))
    })
}
