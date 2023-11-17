import { missionsAPI } from '../../../api/missionsAPI'
import { disableMissionListener, enableMissionListener } from '../../../features/missions/MissionForm/sse'
import { sideWindowActions } from '../../../features/SideWindow/slice'
import { isNewMission } from '../../../utils/isNewMission'
import { getMissionPageRoute } from '../../../utils/routes'
import { sideWindowPaths } from '../../entities/sideWindow'
import { setToast } from '../../shared_slices/Global'
import { multiMissionsActions } from '../../shared_slices/MultiMissions'

export const saveMission =
  (values, reopen = false) =>
  async (dispatch, getState) => {
    const {
      sideWindow: { currentPath }
    } = getState()
    const routeParams = getMissionPageRoute(currentPath)
    const missionIsNewMission = isNewMission(routeParams?.params?.id)

    const cleanValues = missionIsNewMission ? { ...values, id: undefined } : values
    const upsertMission = missionIsNewMission
      ? missionsAPI.endpoints.createMission
      : missionsAPI.endpoints.updateMission
    try {
      disableMissionListener(values.id)
      const response = await dispatch(upsertMission.initiate(cleanValues))
      if ('data' in response) {
        if (reopen) {
          enableMissionListener(values.id)

          return
        }
        dispatch(multiMissionsActions.deleteSelectedMission(values.id))
        dispatch(sideWindowActions.focusAndGoTo(sideWindowPaths.MISSIONS))
      } else {
        throw Error('Erreur à la création ou à la modification de la mission')
      }
    } catch (error) {
      dispatch(setToast({ containerId: 'sideWindow', message: error }))
    }
  }
