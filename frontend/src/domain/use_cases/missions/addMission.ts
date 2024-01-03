import _ from 'lodash'
import { generatePath } from 'react-router'

import { attachReportingToMissionSliceActions } from '../../../features/missions/MissionForm/AttachReporting/slice'
import { missionFormsActions } from '../../../features/missions/MissionForm/slice'
import { missionFactory } from '../../../features/missions/Missions.helpers'
import { sideWindowActions } from '../../../features/SideWindow/slice'
import { isNewMission } from '../../../utils/isNewMission'
import { sideWindowPaths } from '../../entities/sideWindow'

import type { ReportingDetailed } from '../../entities/reporting'

export const addMission = (attachedReporting?: ReportingDetailed) => async (dispatch, getState) => {
  const { missions = {} } = getState().missionForms

  const maxNewMissionId = _.chain(missions)
    .filter(newMission => isNewMission(newMission?.missionForm?.id))
    .maxBy(filteredNewMission => Number(filteredNewMission?.missionForm?.id?.split('new-')[1]))
    .value()

  const id: string =
    maxNewMissionId && maxNewMissionId.missionForm.id
      ? `new-${Number(maxNewMissionId?.missionForm?.id?.split('new-')[1]) + 1}`
      : 'new-1'

  const newMission = { isFormDirty: false, missionForm: missionFactory({ id }, true, attachedReporting) }

  await dispatch(missionFormsActions.setMission(newMission))

  await dispatch(
    attachReportingToMissionSliceActions.setAttachedReportings(attachedReporting ? [attachedReporting] : [])
  )

  await dispatch(sideWindowActions.focusAndGoTo(generatePath(sideWindowPaths.MISSION, { id })))
}
