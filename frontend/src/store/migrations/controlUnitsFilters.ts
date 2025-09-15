import { INITIAL_STATE } from '@features/ControlUnit/components/ControlUnitListDialog/slice'
import isEqual from 'lodash/isEqual'

export const controlUnitsFiltersMigrations = {
  // State is HomeRootState but add it as type creates a circular reference
  v2: (state: any) => {
    if (!state.mapControlUnitListDialog) {
      return state
    }

    const keysToCheck = Object.keys(INITIAL_STATE.filtersState)

    const nbOfFiltersSetted = keysToCheck.reduce(
      (count, key) => (isEqual(state.mapControlUnitListDialog[key], INITIAL_STATE[key]) ? count : count + 1),
      0
    )

    return {
      ...state,
      nbOfFiltersSetted
    }
  }
}
