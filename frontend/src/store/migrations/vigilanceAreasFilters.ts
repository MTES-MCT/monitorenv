import {
  INITIAL_STATE,
  type VigilanceAreaSliceState
} from '@features/VigilanceArea/components/VigilanceAreasList/Filters/slice'
import isEqual from 'lodash/isEqual'

export const vigilanceAreassFiltersMigrations = {
  // State is HomeRootState but add it as type creates a circular reference
  v2: (state: any) => {
    if (!state.vigilanceAreaFilters) {
      return state
    }

    const keysToCheck = Object.keys(INITIAL_STATE).filter(
      key => !['searchQuery'].includes(key)
    ) as (keyof VigilanceAreaSliceState)[]

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
