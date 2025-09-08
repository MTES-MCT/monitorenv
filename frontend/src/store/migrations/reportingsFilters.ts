import { INITIAL_STATE } from 'domain/shared_slices/MissionFilters'
import isEqual from 'lodash/isEqual'

export const reportingsFiltersMigrations = {
  // State is HomeRootState but add it as type creates a circular reference
  v2: (state: any) => {
    if (!state.reportingFilters) {
      return state
    }
    const keysToExclude = ['startedAfter', 'startedBefore']
    const keysToCheck = Object.keys(INITIAL_STATE).filter(key => !keysToExclude.includes(key))

    const nbOfFiltersSetted = keysToCheck.reduce(
      (count, key) => (isEqual(state.reportingFilters[key], INITIAL_STATE[key]) ? count : count + 1),
      0
    )

    return {
      ...state,
      nbOfFiltersSetted
    }
  }
}
