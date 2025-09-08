import { VigilanceArea } from '@features/VigilanceArea/types'
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { vigilanceAreassFiltersMigrations } from '@store/migrations/vigilanceAreasFilters'
import { isEqual } from 'lodash'
import { createMigrate, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const migrations = {
  2: (state: any) => vigilanceAreassFiltersMigrations.v2(state)
}

const persistConfig = {
  key: 'vigilanceAreaFilters',
  migrate: createMigrate(migrations),
  storage,
  version: 2
}

export type VigilanceAreaSliceState = {
  createdBy: string[]
  nbOfFiltersSetted: number
  seaFronts: string[]
  searchQuery: string | undefined
  status: VigilanceArea.Status[]
  visibility: VigilanceArea.Visibility[]
}
export const INITIAL_STATE: VigilanceAreaSliceState = {
  createdBy: [],
  nbOfFiltersSetted: 0,
  seaFronts: [],
  searchQuery: undefined,
  status: [VigilanceArea.Status.DRAFT, VigilanceArea.Status.PUBLISHED],
  visibility: [VigilanceArea.Visibility.PUBLIC, VigilanceArea.Visibility.PRIVATE]
}
export const vigilanceAreaFiltersSlice = createSlice({
  initialState: INITIAL_STATE,
  name: 'vigilanceAreaFilters',
  reducers: {
    resetFilters: () => INITIAL_STATE,
    setSearchQueryFilter: (state, action: PayloadAction<string | undefined>) => {
      state.searchQuery = action.payload
    },
    updateFilters: <K extends keyof VigilanceAreaSliceState>(
      state: VigilanceAreaSliceState,
      action: PayloadAction<{
        key: K
        value: VigilanceAreaSliceState[keyof VigilanceAreaSliceState]
      }>
    ) => {
      const nextState = {
        ...state,
        [action.payload.key]: action.payload.value
      }

      const keysToCheck = Object.keys(INITIAL_STATE).filter(
        key => !['searchQuery'].includes(key)
      ) as (keyof VigilanceAreaSliceState)[]

      const nbOfFiltersSetted = keysToCheck.reduce(
        (count, key) => (isEqual(nextState[key], INITIAL_STATE[key]) ? count : count + 1),
        0
      )

      return {
        ...nextState,
        nbOfFiltersSetted
      }
    }
  }
})

export const vigilanceAreaFiltersActions = vigilanceAreaFiltersSlice.actions
export const vigilanceAreaFiltersPersistedReducer = persistReducer(persistConfig, vigilanceAreaFiltersSlice.reducer)
