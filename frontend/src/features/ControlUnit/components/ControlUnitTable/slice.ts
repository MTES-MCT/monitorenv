import { type PayloadAction, createSlice } from '@reduxjs/toolkit'
import { set } from 'lodash-es'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import type { FiltersState } from './types'

interface ControlUnitTableState {
  filtersState: FiltersState
}

const INITIAL_STATE: ControlUnitTableState = {
  filtersState: {
    administrationId: undefined,
    isArchived: false,
    query: undefined
  }
}

const persistConfig = {
  key: 'controlUnitTable',
  storage
}

const controlUnitTableSlice = createSlice({
  initialState: INITIAL_STATE,
  name: 'controlUnitTable',
  reducers: {
    setFilter(
      state,
      action: PayloadAction<{
        key: keyof FiltersState
        value: any
      }>
    ) {
      state.filtersState = set(state.filtersState, action.payload.key, action.payload.value)
    }
  }
})

export const controlUnitTableActions = controlUnitTableSlice.actions

export const controlUnitTablePersistedReducer = persistReducer(persistConfig, controlUnitTableSlice.reducer)
