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
  async dispatch => {
    dispatch(missionFormsActions.setIsControlUnitAlreadyEngaged(false))

    // update filters to redirect to list with only pending mission with the control unit selected
    await dispatch(resetMissionFilters())

    const twoMonthsAgo = customDayjs().subtract(2, 'month').toISOString()
    await dispatch(updateFilters({ key: MissionFiltersEnum.PERIOD_FILTER, value: DateRangeEnum.CUSTOM }))
    await dispatch(updateFilters({ key: MissionFiltersEnum.STARTED_AFTER_FILTER, value: twoMonthsAgo }))
    await dispatch(updateFilters({ key: MissionFiltersEnum.STARTED_BEFORE_FILTER, value: customDayjs().toISOString() }))

    await dispatch(updateFilters({ key: MissionFiltersEnum.UNIT_FILTER, value: [controlUnitId] }))
    await dispatch(updateFilters({ key: MissionFiltersEnum.STATUS_FILTER, value: [MissionStatusEnum.PENDING] }))

    const missionPathToClose = generatePath(sideWindowPaths.MISSION, { id: missionId })
    await dispatch(deleteTab(missionPathToClose))
  }
