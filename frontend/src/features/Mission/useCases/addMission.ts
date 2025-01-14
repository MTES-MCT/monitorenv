import { isMissionNew } from '@features/Mission/utils'
import { sideWindowActions } from '@features/SideWindow/slice'
import { type ControlUnit } from '@mtes-mct/monitor-ui'
import { sideWindowPaths } from 'domain/entities/sideWindow'
import { chain } from 'lodash'
import { generatePath } from 'react-router'

import { attachReportingToMissionSliceActions } from '../components/MissionForm/AttachReporting/slice'
import { missionFormsActions } from '../components/MissionForm/slice'
import { missionFactory } from '../Missions.helpers'

import type { HomeAppThunk } from '../../../store'
import type { Reporting } from 'domain/entities/reporting'

export const addMission =
  ({
    attachedReporting,
    initialControlUnit
  }: Partial<{
    attachedReporting: Reporting
    initialControlUnit: ControlUnit.ControlUnit
  }> = {}): HomeAppThunk =>
  async (dispatch, getState) => {
    const { missions = {} } = getState().missionForms

    const maxNewMissionId = chain(missions)
      .filter(newMission => isMissionNew(newMission.missionForm.id))
      .maxBy(filteredNewMission => Number(String(filteredNewMission.missionForm.id).split('new-')[1]))
      .value()

    const id: string = maxNewMissionId?.missionForm.id
      ? `new-${Number(String(maxNewMissionId.missionForm.id).split('new-')[1]) + 1}`
      : 'new-1'

    const initialMission: any = { id }
    if (initialControlUnit) {
      initialMission.controlUnits = [
        {
          administration: initialControlUnit.administration.name,
          id: initialControlUnit.id,
          isArchived: false,
          name: initialControlUnit.name,
          resources: []
        }
      ]
    }

    const newMission = {
      engagedControlUnit: undefined,
      isFormDirty: false,
      missionForm: missionFactory(initialMission, true, attachedReporting)
    }

    await dispatch(missionFormsActions.setMission(newMission))

    await dispatch(
      attachReportingToMissionSliceActions.setAttachedReportings(attachedReporting ? [attachedReporting] : [])
    )

    await dispatch(sideWindowActions.focusAndGoTo(generatePath(sideWindowPaths.MISSION, { id })))
  }
