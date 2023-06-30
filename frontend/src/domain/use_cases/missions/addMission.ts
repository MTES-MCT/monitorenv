import _ from 'lodash'
import { generatePath } from 'react-router'

import { missionFactory } from '../../../features/missions/Missions.helpers'
import { sideWindowActions } from '../../../features/SideWindow/slice'
import { isNewMission } from '../../../utils/isNewMission'
import { sideWindowPaths } from '../../entities/sideWindow'
import { multiMissionsActions } from '../../shared_slices/MultiMissions'

export const addMission = () => async (dispatch, getState) => {
  const {
    multiMissions: { selectedMissions }
  } = getState()
  const missions = [...selectedMissions]

  const maxNewMissionId = _.chain(missions)
    .filter(newMission => isNewMission(newMission.mission.id))
    .maxBy(filteredNewMission => Number(filteredNewMission?.mission?.id?.split('new-')[1]))
    .value()

  const id =
    maxNewMissionId && maxNewMissionId.mission.id
      ? `new-${Number(maxNewMissionId?.mission?.id?.split('new-')[1]) + 1}`
      : 'new-1'

  const missionsUpdated = [...missions, { isFormDirty: false, mission: missionFactory(undefined, id) }]

  await dispatch(multiMissionsActions.setSelectedMissions(missionsUpdated))

  dispatch(sideWindowActions.focusAndGoTo(generatePath(sideWindowPaths.MISSION, { id })))
}
