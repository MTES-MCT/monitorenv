import { generatePath } from 'react-router'

import { missionsAPI } from '../../../api/missionsAPI'
import { removeMissionListener } from '../../../features/missions/MissionForm/sse'
import { attachReportingToMissionSliceActions } from '../../../features/missions/slice'
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
  const response = dispatch(missionToEdit.initiate(missionId))

  response
    .then(async result => {
      if (!result.data) {
        throw Error('Erreur à la création ou à la modification de la mission')
      }

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
      const missionToSave = result.data
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
      await dispatch(sideWindowActions.focusAndGoTo(generatePath(sideWindowPaths.MISSION, { id: missionId })))

      response.unsubscribe()
    })
    .catch(error => {
      removeMissionListener(missionId)
      dispatch(setToast({ containerId: 'sideWindow', message: error }))
    })
}
