import { missionFormsActions } from '@features/Mission/components/MissionForm/slice'
import { missionActions } from '@features/Mission/slice'
import omit from 'lodash/omit'
import { generatePath } from 'react-router'

import { missionsAPI } from '../../../api/missionsAPI'
import { ApiErrorCode } from '../../../api/types'
import { sideWindowPaths } from '../../../domain/entities/sideWindow'
import { setToast } from '../../../domain/shared_slices/Global'
import { reportingActions } from '../../../domain/shared_slices/reporting'
import {
  MapInteractionListenerEnum,
  updateMapInteractionListeners
} from '../../../domain/use_cases/map/updateMapInteractionListeners'
import { isNewMission } from '../../../utils/isNewMission'
import { getMissionPageRoute } from '../../../utils/routes'
import { sideWindowActions } from '../../SideWindow/slice'

export const saveMission =
  (values, reopen = false, quitAfterSave = false) =>
  async (dispatch, getState) => {
    const {
      reporting: { reportings },
      sideWindow: { currentPath }
    } = getState()
    const selectedMissions = getState().missionForms.missions

    const actions = [...values.envActions]
    const sortedActions = actions.sort((a, b) => a.id - b.id)
    const valuesToSave = omit({ ...values, envActions: sortedActions }, [
      'attachedReportings',
      'detachedReportings',
      'fishActions'
    ])
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

          // wait for the mission to be updated in the form before displaying the banner
          setTimeout(async () => {
            await dispatch(missionFormsActions.setShowCreatedBanner({ id: missionUpdated.id, showBanner: true }))
          }, 250)
        } else {
          // for a mission already created we want to update the `updatedAt` value with the new one
          const mission = selectedMissions[values.id]
          await dispatch(
            missionFormsActions.setMission({
              ...mission,
              displayCreatedMissionBanner: false,
              // since mission has just been saved, it's not dirty anymore
              isFormDirty: false,
              missionForm: missionUpdated
            })
          )
        }

        setTimeout(async () => {
          await dispatch(missionFormsActions.setIsListeningToEvents(true))
        }, 500)

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
