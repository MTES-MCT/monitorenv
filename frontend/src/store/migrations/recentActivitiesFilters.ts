import { INITIAL_STATE, RecentActivityFiltersEnum } from '@features/RecentActivity/slice'
import isEqual from 'lodash/isEqual'

export const recentActivitiesFiltersMigrations = {
  // State is HomeRootState but add it as type creates a circular reference
  v2: (state: any) => {
    if (!state.recentActivity) {
      return state
    }

    const keysToCheck = Object.values(RecentActivityFiltersEnum)

    const nbOfFiltersSetted = keysToCheck.reduce(
      (count, key) => (isEqual(state.recentActivity.filters[key], INITIAL_STATE.filters[key]) ? count : count + 1),
      0
    )

    return {
      ...state,
      nbOfFiltersSetted
    }
  }
}
