import { INITIAL_STATE } from '@features/Reportings/Filters/slice'
import { isEqual } from 'lodash-es'

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
  }
}
