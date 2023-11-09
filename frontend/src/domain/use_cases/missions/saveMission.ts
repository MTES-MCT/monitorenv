import omit from 'lodash/omit'

import { missionsAPI } from '../../../api/missionsAPI'
import { ApiErrorCode } from '../../../api/types'
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
    const valuesToSave = omit(values, ['attachedReportings', 'detachedReportings', 'detachedReportingIds'])
    const routeParams = getMissionPageRoute(currentPath)
    const missionIsNewMission = isNewMission(routeParams?.params?.id)

    const cleanValues = missionIsNewMission ? { ...valuesToSave, id: undefined } : valuesToSave
    const upsertMission = missionIsNewMission
      ? missionsAPI.endpoints.createMission
      : missionsAPI.endpoints.updateMission
    try {
      const response = await dispatch(upsertMission.initiate(cleanValues))
      if ('data' in response) {
        if (reopen) {
          return
        }
        dispatch(multiMissionsActions.deleteSelectedMission(values.id))
        dispatch(updateMapInteractionListeners(MapInteractionListenerEnum.NONE))
        dispatch(sideWindowActions.focusAndGoTo(sideWindowPaths.MISSIONS))

        const missionUpdated = response.data
        // we want to update openings reportings with new attached or detached mission
        await updateReportingsWithAttachedMission({
          attachedReportingIds: values.attachedReportingIds,
          dispatch,
          missionUpdated,
          reportings
        })
      } else {
        if (response.error.data.type === ApiErrorCode.DUPLICATE_ATTACHED_REPORTING) {
          throw Error('Le signalement est déjà rattaché à une mission')
        }
        throw Error('Erreur à la création ou à la modification de la mission')
      }
    } catch (error) {
      dispatch(setToast({ containerId: 'sideWindow', message: error }))
    }
  }

async function updateReportingsWithAttachedMission({ attachedReportingIds, dispatch, missionUpdated, reportings }) {
  await attachedReportingIds.map(async id => {
    if (reportings[id]) {
      const reportingUpdatedIndex = missionUpdated.attachedReportings.findIndex(reporting => reporting.id === id)

      const { attachedToMissionAtUtc, detachedFromMissionAtUtc } =
        missionUpdated.attachedReportings[reportingUpdatedIndex]
      await dispatch(
        reportingActions.setReporting({
          ...reportings[id],
          reporting: {
            ...reportings[id].reporting,
            attachedMission: !detachedFromMissionAtUtc ? missionUpdated : undefined,
            attachedToMissionAtUtc,
            detachedFromMissionAtUtc,
            missionId: missionUpdated.id
          }
        })
      )
    }

    return undefined
  })
}
