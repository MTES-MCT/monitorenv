import _ from 'lodash'
import { generatePath } from 'react-router'

import { missionFactory } from '../../../features/missions/Missions.helpers'
import { sideWindowActions } from '../../../features/SideWindow/slice'
import { sideWindowPaths } from '../../entities/sideWindow'
import { setMissionState } from '../../shared_slices/MissionsState'
import { setMultiMissionsState } from '../../shared_slices/MultiMissionsState'

export const addMission = () => async (dispatch, getState) => {
  const {
    multiMissionsState: { multiMissionsState }
  } = getState()
  const missions = [...multiMissionsState]
  dispatch(setMissionState(undefined))

  const maxNewMissionId = _.chain(missions)
    .filter(newMission => newMission.type === 'new')
    .maxBy(filteredNewMission => filteredNewMission.mission.id)
    .value()

  const id = maxNewMissionId && maxNewMissionId.mission.id ? maxNewMissionId.mission.id + 1 : 1

  const missionsUpdated = [
    ...missions,
    { isFormDirty: false, mission: missionFactory(undefined, Number(id)), type: 'new' }
  ]

  await dispatch(setMultiMissionsState(missionsUpdated))

  dispatch(sideWindowActions.focusAndGoTo(generatePath(sideWindowPaths.MISSION_NEW, { id })))
}
