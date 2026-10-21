import { INITIAL_STATE } from '@features/Reportings/Filters/slice'
import isEqual from 'lodash/isEqual'

import { StatusFilterEnum } from '../../domain/entities/reporting'

export const reportingsFiltersMigrations = {
  v2: (state: any) => {
    if (!state) {
      return state
    }
    const keysToExclude = ['startedAfter', 'startedBefore']
    const keysToCheck = Object.keys(INITIAL_STATE).filter(key => !keysToExclude.includes(key))

    const nbOfFiltersSetted = keysToCheck.reduce(
      (count, key) => (isEqual(state[key], INITIAL_STATE[key]) ? count : count + 1),
      0
    )

    return {
      ...state,
      nbOfFiltersSetted
    }
  },
  v3: (state: any) => {
    if (!state) {
      return state
    }

    return {
      ...state,
      isAttachedToMissionFilter: undefined,
      statusFilter: StatusFilterEnum.IN_PROGRESS
    }
  }
}
