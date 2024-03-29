import { customDayjs } from '@mtes-mct/monitor-ui'
import { generatePath } from 'react-router'

import { deleteTab } from './deleteTab'
import { missionFormsActions } from '../../../features/missions/MissionForm/slice'
import { DateRangeEnum } from '../../entities/dateRange'
import { MissionStatusEnum } from '../../entities/missions'
import { sideWindowPaths } from '../../entities/sideWindow'
import { MissionFiltersEnum, resetMissionFilters, updateFilters } from '../../shared_slices/MissionFilters'

export const cancelCreateAndRedirectToFilteredList =
  ({ controlUnitId, missionId }) =>
  dispatch => {
    dispatch(missionFormsActions.setEngagedControlUnit(undefined))

    // update filters to redirect to list with only pending mission with the control unit selected
    dispatch(resetMissionFilters())

    const twoMonthsAgo = customDayjs().subtract(2, 'month').toISOString()
    dispatch(updateFilters({ key: MissionFiltersEnum.PERIOD_FILTER, value: DateRangeEnum.CUSTOM }))
    dispatch(updateFilters({ key: MissionFiltersEnum.STARTED_AFTER_FILTER, value: twoMonthsAgo }))
    dispatch(updateFilters({ key: MissionFiltersEnum.STARTED_BEFORE_FILTER, value: customDayjs().toISOString() }))

    dispatch(updateFilters({ key: MissionFiltersEnum.UNIT_FILTER, value: [controlUnitId] }))
    dispatch(updateFilters({ key: MissionFiltersEnum.STATUS_FILTER, value: [MissionStatusEnum.PENDING] }))

    const missionPathToClose = generatePath(sideWindowPaths.MISSION, { id: missionId })
    dispatch(deleteTab(missionPathToClose, true))
  }
