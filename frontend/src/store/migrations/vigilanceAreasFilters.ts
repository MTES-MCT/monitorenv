import { INITIAL_STATE } from '@features/VigilanceArea/components/VigilanceAreasList/Filters/slice'
import isEqual from 'lodash/isEqual'

export const vigilanceAreasFiltersMigrations = {
  v2: (state: any) => {
    if (!state) {
      return state
    }

    const keysToCheck = Object.keys(INITIAL_STATE).filter(key => !['nbOfFiltersSetted', 'specificPeriod'].includes(key))

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
