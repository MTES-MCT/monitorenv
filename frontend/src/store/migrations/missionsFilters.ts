import { INITIAL_STATE } from 'domain/shared_slices/MissionFilters'
import { isEqual } from 'lodash-es'

export const missionFiltersMigrations = {
  v2: (state: any) => {
    if (!state) {
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
