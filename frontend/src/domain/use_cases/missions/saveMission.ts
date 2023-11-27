import omit from 'lodash/omit'

import { missionsAPI } from '../../../api/missionsAPI'
import { ApiErrorCode } from '../../../api/types'
import {
  disableMissionListener,
  enableMissionListener,
  removeMissionListener
} from '../../../features/missions/MissionForm/sse'
import { sideWindowActions } from '../../../features/SideWindow/slice'
import { isNewMission } from '../../../utils/isNewMission'
import { getMissionPageRoute } from '../../../utils/routes'
import { sideWindowPaths } from '../../entities/sideWindow'
import { setToast } from '../../shared_slices/Global'
import { multiMissionsActions } from '../../shared_slices/MultiMissions'
import { reportingActions } from '../../shared_slices/reporting'
import { MapInteractionListenerEnum, updateMapInteractionListeners } from '../map/updateMapInteractionListeners'

export const saveMission =
  (values, reopen = false) =>
  async (dispatch, getState) => {
    const {
      reporting: { reportings },
      sideWindow: { currentPath }
    } = getState()
    const valuesToSave = omit(values, ['attachedReportings', 'detachedReportings'])
    const routeParams = getMissionPageRoute(currentPath)
    const missionIsNewMission = isNewMission(routeParams?.params?.id)

    const newOrNextMissionData = missionIsNewMission ? { ...valuesToSave, id: undefined } : valuesToSave
    const upsertMission = missionIsNewMission
      ? missionsAPI.endpoints.createMission
      : missionsAPI.endpoints.updateMission
    try {
      disableMissionListener(values.id)
      const response = await dispatch(upsertMission.initiate(newOrNextMissionData))
      if ('data' in response) {
        if (reopen) {
          enableMissionListener(values.id)

          return
        }
        dispatch(multiMissionsActions.deleteSelectedMission(values.id))
        dispatch(updateMapInteractionListeners(MapInteractionListenerEnum.NONE))
        dispatch(sideWindowActions.focusAndGoTo(sideWindowPaths.MISSIONS))

        removeMissionListener(values.id)

        const missionUpdated = response.data
        // we want to update openings reportings with new attached or detached mission
        await updateReportingsWithAttachedMission({
          dispatch,
          missionUpdated,
          reportings
        })
      } else {
        if (response.error.data.type === ApiErrorCode.CHILD_ALREADY_ATTACHED) {
          throw Error('Le signalement est déjà rattaché à une mission')
        }
        throw Error('Erreur à la création ou à la modification de la mission')
      }
    } catch (error) {
      dispatch(setToast({ containerId: 'sideWindow', message: error }))
    }
  }

async function updateReportingsWithAttachedMission({ dispatch, missionUpdated, reportings }) {
  missionUpdated.attachedReportings.forEach(async ({ attachedToMissionAtUtc, detachedFromMissionAtUtc, id }) => {
    if (reportings[id]) {
      await dispatch(
        reportingActions.setReporting({
          ...reportings[id],
          reporting: {
            ...reportings[id].reporting,
            attachedMission: missionUpdated,
            attachedToMissionAtUtc,
            detachedFromMissionAtUtc,
            missionId: missionUpdated.id
          }
        })
      )
    }
  })

  missionUpdated.detachedReportings.forEach(async ({ attachedToMissionAtUtc, detachedFromMissionAtUtc, id }) => {
    if (reportings[id]) {
      await dispatch(
        reportingActions.setReporting({
          ...reportings[id],
          reporting: {
            ...reportings[id].reporting,
            attachedMission: undefined,
            attachedToMissionAtUtc,
            detachedFromMissionAtUtc,
            missionId: missionUpdated.id
          }
        })
      )
    }
  })
}
