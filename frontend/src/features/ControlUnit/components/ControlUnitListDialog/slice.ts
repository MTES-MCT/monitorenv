import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { controlUnitsFiltersMigrations } from '@store/migrations/controlUnitsFilters'
import { isEqual } from 'lodash'
import { createMigrate, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import type { FiltersState } from './types'

type ControlUnitListDialogState = {
  filtersState: FiltersState
  numberOfFiltersSetted: number
}

export const INITIAL_STATE: ControlUnitListDialogState = {
  filtersState: {
    administrationId: undefined,
    categories: undefined,
    query: undefined,
    stationId: undefined,
    type: undefined
  },
  numberOfFiltersSetted: 0
}
const migrations = {
  2: (state: any) => controlUnitsFiltersMigrations.v2(state)
}

const persistConfig = {
  key: 'controlUnitListDialog',
  migrate: createMigrate(migrations),
  storage,
  version: 2
}

const controlUnitListDialogSlice = createSlice({
  initialState: INITIAL_STATE,
  name: 'controlUnitListDialog',
  reducers: {
    resetFilters() {
      return INITIAL_STATE
    },
    setFilter(
      state,
      action: PayloadAction<{
        key: keyof FiltersState
        value: FiltersState[keyof FiltersState]
      }>
    ) {
      const nextState = {
        ...state.filtersState,
        [action.payload.key]: action.payload.value
      }
      state.filtersState = nextState
      const keysToCheck = Object.keys(INITIAL_STATE.filtersState)

      state.numberOfFiltersSetted = keysToCheck.reduce(
        (count, key) => (isEqual(nextState[key], INITIAL_STATE.filtersState[key]) ? count : count + 1),
        0
      )
    }
  }
})

export const controlUnitListDialogActions = controlUnitListDialogSlice.actions

export const controlUnitListDialogPersistedReducer = persistReducer(persistConfig, controlUnitListDialogSlice.reducer)
