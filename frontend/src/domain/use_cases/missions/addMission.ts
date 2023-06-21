import _ from 'lodash'
import { generatePath } from 'react-router'

import { missionFactory } from '../../../features/missions/Missions.helpers'
import { sideWindowActions } from '../../../features/SideWindow/slice'
import { sideWindowPaths } from '../../entities/sideWindow'
import { setMultiMissionsState } from '../../shared_slices/MultiMissionsState'

export const addMission = () => (dispatch, getState) => {
  const {
    multiMissionsState: { multiMissionsState }
  } = getState()

  const maxNewMissionId = _.chain(multiMissionsState)
    .filter(newMission => newMission.type === 'new')
    .maxBy(filteredNewMission => filteredNewMission.mission.id)
    .value()

  const id = maxNewMissionId && maxNewMissionId.mission.id ? maxNewMissionId.mission.id + 1 : 1

  dispatch(
    setMultiMissionsState([
      ...multiMissionsState,
      { isFormDirty: false, mission: missionFactory(undefined, Number(id)), type: 'new' }
    ])
  )
  dispatch(sideWindowActions.focusAndGoTo(generatePath(sideWindowPaths.MISSION_NEW, { id })))
}
