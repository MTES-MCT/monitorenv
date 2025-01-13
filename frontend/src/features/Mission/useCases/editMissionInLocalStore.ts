import { missionsAPI } from '@api/missionsAPI'
import { sideWindowActions } from '@features/SideWindow/slice'
import { ErrorType } from 'domain/entities/errors'
import { sideWindowPaths } from 'domain/entities/sideWindow'
import { setToast } from 'domain/shared_slices/Global'
import { generatePath } from 'react-router'

import { attachReportingToMissionSliceActions } from '../components/MissionForm/AttachReporting/slice'
import { missionFormsActions } from '../components/MissionForm/slice'
import { missionActions } from '../slice'

export const editMissionInLocalStore =
  (missionId: number, context: 'map' | 'sideWindow') => async (dispatch, getState) => {
    const { missions } = getState().missionForms

    const missionToEdit = missionsAPI.endpoints.getMission

    if (missions[missionId]) {
      await setMission(dispatch, missions[missionId])

      return
    }
    try {
      const missionRequest = dispatch(missionToEdit.initiate(missionId))
      const missionResponse = await missionRequest.unwrap()

      if (!missionResponse.mission) {
        throw Error()
      }

      if (missionResponse.status === 206) {
        dispatch(
          setToast({
            containerId: 'sideWindow',
            message:
              "Problème de communication avec MonitorFish ou RapportNav: impossible de récupérer les événements du CNSP ou de l'unité",
            type: ErrorType.WARNING
          })
        )
      }

      const missionToSave = missionResponse.mission
      const missionFormatted = {
        isFormDirty: false,
        missionForm: missionToSave
      }

      setMission(dispatch, missionFormatted)

      await missionRequest.unsubscribe()
    } catch (error) {
      dispatch(setToast({ containerId: context, message: 'Erreur à la récupération de la mission' }))
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
