import { missionsAPI } from '@api/missionsAPI'
import { addMainWindowBanner } from '@features/MainWindow/useCases/addMainWindowBanner'
import { sideWindowActions } from '@features/SideWindow/slice'
import { addSideWindowBanner } from '@features/SideWindow/useCases/addSideWindowBanner'
import { Level } from '@mtes-mct/monitor-ui'
import { sideWindowPaths } from 'domain/entities/sideWindow'
import { generatePath } from 'react-router'

import { attachReportingToMissionSliceActions } from '../components/MissionForm/AttachReporting/slice'
import { missionFormsActions } from '../components/MissionForm/slice'
import { missionActions } from '../slice'

import type { HomeAppThunk } from '@store/index'

export const editMissionInLocalStore =
  (missionId: number, context: 'map' | 'sideWindow'): HomeAppThunk =>
  async (dispatch, getState) => {
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
          addSideWindowBanner({
            children:
              "Problème de communication avec MonitorFish ou RapportNav: impossible de récupérer les événements du CNSP ou de l'unité",
            isClosable: true,
            isFixed: true,
            level: Level.WARNING,
            withAutomaticClosing: true
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
      if (context === 'map') {
        dispatch(
          addMainWindowBanner({
            children: 'Erreur à la récupération de la mission',
            isClosable: true,
            isFixed: true,
            level: Level.ERROR,
            withAutomaticClosing: true
          })
        )
      } else {
        dispatch(
          addSideWindowBanner({
            children: 'Erreur à la récupération de la mission',
            isClosable: true,
            isFixed: true,
            level: Level.ERROR,
            withAutomaticClosing: true
          })
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
