import { missionFormsActions } from '@features/Mission/components/MissionForm/slice'
import { customDayjs } from '@mtes-mct/monitor-ui'
import { DateRangeEnum } from 'domain/entities/dateRange'
import { MissionStatusEnum } from 'domain/entities/missions'
import { sideWindowPaths } from 'domain/entities/sideWindow'
import { MissionFiltersEnum, resetMissionFilters, updateFilters } from 'domain/shared_slices/MissionFilters'
import { generatePath } from 'react-router'

import { deleteTab } from './deleteTab'

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
