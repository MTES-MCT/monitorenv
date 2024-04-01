import omit from 'lodash/omit'
import { generatePath } from 'react-router'

import { missionsAPI } from '../../../api/missionsAPI'
import { ApiErrorCode } from '../../../api/types'
import { missionFormsActions } from '../../../features/missions/MissionForm/slice'
import { missionActions } from '../../../features/missions/slice'
import { sideWindowActions } from '../../../features/SideWindow/slice'
import { isNewMission } from '../../../utils/isNewMission'
import { getMissionPageRoute } from '../../../utils/routes'
import { sideWindowPaths } from '../../entities/sideWindow'
import { setToast } from '../../shared_slices/Global'
import { reportingActions } from '../../shared_slices/reporting'
import { MapInteractionListenerEnum, updateMapInteractionListeners } from '../map/updateMapInteractionListeners'

export const saveMission =
  (values, reopen = false, quitAfterSave = false) =>
  async (dispatch, getState) => {
    const {
      reporting: { reportings },
      sideWindow: { currentPath }
    } = getState()
    const selectedMissions = getState().missionForms.missions

    const valuesToSave = omit(values, ['attachedReportings', 'detachedReportings', 'fishActions'])
    const routeParams = getMissionPageRoute(currentPath)
    const missionIsNewMission = isNewMission(routeParams?.params?.id)
    await dispatch(missionFormsActions.setIsListeningToEvents(false))

    const newOrNextMissionData = missionIsNewMission ? { ...valuesToSave, id: undefined } : valuesToSave
    const upsertMission = missionIsNewMission
      ? missionsAPI.endpoints.createMission
      : missionsAPI.endpoints.updateMission
    try {
      const response = await dispatch(upsertMission.initiate(newOrNextMissionData))
      if ('data' in response) {
        const missionUpdated = response.data

        setTimeout(async () => {
          await dispatch(missionFormsActions.setIsListeningToEvents(true))
        }, 250)

        // We save the new properties : `id`, `createdAt`, `updatedAt` after a mission creation/update
        if (missionIsNewMission) {
          await dispatch(
            missionFormsActions.setCreatedMission({
              createdMission: {
                engagedControlUnit: undefined,
                isFormDirty: false,
                missionForm: missionUpdated
              },
              previousId: values.id
            })
          )

          await dispatch(missionActions.setSelectedMissionIdOnMap(missionUpdated.id))
          const nextPath = generatePath(sideWindowPaths.MISSION, { id: missionUpdated.id })
          await dispatch(sideWindowActions.setCurrentPath(nextPath))
        } else {
          // for a mission already created we want to update the `updatedAt` value with the new one
          const mission = selectedMissions[values.id]
          dispatch(
            missionFormsActions.setMission({
              ...mission,
              isFormDirty: false, // since mission has just been saved, it's not dirty anymore
              missionForm: missionUpdated
            })
          )
        }

        if (reopen || !quitAfterSave) {
          return
        }

        await dispatch(missionFormsActions.deleteSelectedMission(missionUpdated.id))
        dispatch(updateMapInteractionListeners(MapInteractionListenerEnum.NONE))
        dispatch(sideWindowActions.focusAndGoTo(sideWindowPaths.MISSIONS))

        // we want to update openings reportings with new attached or detached mission
        await updateReportingsWithAttachedMission({
          dispatch,
          missionUpdated,
          reportings
        })
      } else {
        if (response.error?.data?.type === ApiErrorCode.CHILD_ALREADY_ATTACHED) {
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
