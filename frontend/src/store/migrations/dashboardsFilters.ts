import { INITIAL_LIST_FILTERS_STATE } from '@features/Dashboard/components/DashboardForm/slice'
import isEqual from 'lodash/isEqual'

export const dashboardsFiltersMigrations = {
  v2: (state: any) => {
    if (!state) {
      return state
    }

    const keysToCheck = Object.keys(INITIAL_LIST_FILTERS_STATE)

    const nbOfFiltersSetted = keysToCheck.reduce(
      (count, key) => (isEqual(state.filters[key], INITIAL_LIST_FILTERS_STATE[key]) ? count : count + 1),
      0
    )

    return {
      ...state,
      nbOfFiltersSetted
    }
  }
}
