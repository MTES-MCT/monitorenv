import { INITIAL_DASHBOARD_FILTERS } from '@features/Dashboard/components/DashboardForm/slice'
import isEqual from 'lodash/isEqual'

export const dashboardsFiltersMigrations = {
  // State is HomeRootState but add it as type creates a circular reference
  v2: (state: any) => {
    if (!state.dashboardFilters) {
      return state
    }

    const keysToCheck = Object.keys(INITIAL_DASHBOARD_FILTERS.filters)

    const nbOfFiltersSetted = keysToCheck.reduce(
      (count, key) =>
        isEqual(state.dashboardFilters.filters[key], INITIAL_DASHBOARD_FILTERS.filters[key]) ? count : count + 1,
      0
    )

    return {
      ...state,
      nbOfFiltersSetted
    }
  }
}
