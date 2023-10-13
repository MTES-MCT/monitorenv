import _ from 'lodash'
import { generatePath } from 'react-router'

import { attachReportingToMissionSliceActions } from '../../../features/missions/MissionForm/AttachReporting/slice'
import { missionFactory } from '../../../features/missions/Missions.helpers'
import { sideWindowActions } from '../../../features/SideWindow/slice'
import { isNewMission } from '../../../utils/isNewMission'
import { sideWindowPaths } from '../../entities/sideWindow'
import { multiMissionsActions } from '../../shared_slices/MultiMissions'

import type { Reporting } from '../../entities/reporting'

export const addMission = (attachedReporting?: Reporting) => async (dispatch, getState) => {
  const {
    missionState: { isFormDirty, missionState },
    multiMissions: { selectedMissions }
  } = getState()
  const missions = [...selectedMissions]

  if (missionState) {
    const selectedMissionIndex = missions.findIndex(mission => mission.mission.id === missionState.id)

    const missionFormatted = {
      isFormDirty,
      mission: missionState
    }

    if (selectedMissionIndex !== -1) {
      missions[selectedMissionIndex] = missionFormatted
    } else {
      missions.push(missionFormatted)
    }
  }
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

  await dispatch(
    attachReportingToMissionSliceActions.setAttachedReportings(attachedReporting ? [attachedReporting] : [])
  )
  await dispatch(
    attachReportingToMissionSliceActions.setAttachedReportingIds(attachedReporting ? [attachedReporting?.id] : [])
  )

  dispatch(sideWindowActions.focusAndGoTo(generatePath(sideWindowPaths.MISSION, { id })))
}
