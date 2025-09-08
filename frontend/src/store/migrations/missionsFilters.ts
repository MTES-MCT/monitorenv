import { INITIAL_STATE } from 'domain/shared_slices/MissionFilters'
import isEqual from 'lodash/isEqual'

export const missionFiltersMigrations = {
  // State is HomeRootState but add it as type creates a circular reference
  v2: (state: any) => {
    if (!state.missionFilters) {
      return state
    }

    const keysToExclude = ['startedAfter', 'startedBefore', 'nbOfFiltersSetted']

    const keysToCheck = Object.keys(INITIAL_STATE).filter(key => !keysToExclude.includes(key))

    const nbOfFiltersSetted = keysToCheck.reduce(
      (count, key) => (isEqual(state[key], INITIAL_STATE[key]) ? count : count + 1),
      0
    )

    return {
      ...state,
      nbOfFiltersSetted
    }
  }
}
