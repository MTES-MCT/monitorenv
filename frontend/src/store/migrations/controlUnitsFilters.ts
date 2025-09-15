import { INITIAL_STATE } from '@features/ControlUnit/components/ControlUnitListDialog/slice'
import isEqual from 'lodash/isEqual'

export const controlUnitsFiltersMigrations = {
  v2: (state: any) => {
    if (!state) {
      return state
    }

    const keysToCheck = Object.keys(INITIAL_STATE.filtersState)

    const nbOfFiltersSetted = keysToCheck.reduce(
      (count, key) => (isEqual(state.filtersState[key], INITIAL_STATE.filtersState[key]) ? count : count + 1),
      0
    )

    return {
      ...state,
      nbOfFiltersSetted
    }
  }
}
