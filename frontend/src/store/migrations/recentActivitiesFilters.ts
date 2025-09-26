import { INITIAL_STATE, RecentActivityFiltersEnum } from '@features/RecentActivity/slice'
import { isEqual } from 'lodash-es'

export const recentActivitiesFiltersMigrations = {
  v2: (state: any) => {
    if (!state) {
      return state
    }

    const keysToCheck = Object.values(RecentActivityFiltersEnum)

    const nbOfFiltersSetted = keysToCheck.reduce(
      (count, key) => (isEqual(state.filters[key], INITIAL_STATE.filters[key]) ? count : count + 1),
      0
    )

    return {
      ...state,
      nbOfFiltersSetted
    }
  }
}
